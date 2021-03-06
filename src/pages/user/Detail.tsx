import React from 'react';
import "./Detail.less"
import TankComponent from "../../common/component/TankComponent";
import {Button, Tag} from 'antd';
import InfoCell from "../widget/InfoCell";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import DateUtil from "../../common/util/DateUtil";
import TankTitle from '../widget/TankTitle';
import TankContentCard from "../widget/TankContentCard";
import {Link, RouteComponentProps} from "react-router-dom";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import {UserRole, UserRoleMap} from "../../common/model/user/UserRole";
import FileUtil from "../../common/util/FileUtil";
import {UserStatus, UserStatusMap} from "../../common/model/user/UserStatus";
import BrowserUtil from "../../common/util/BrowserUtil";
import SingleTextModal from "../widget/SingleTextModal";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import ChangePasswordModal from "./widget/ChangePasswordModal";
import {EditOutlined, UnlockOutlined, UserSwitchOutlined} from '@ant-design/icons';
import TransfigurationModal from "./widget/TransfigurationModal";
import {StopOutlined} from "@ant-design/icons/lib";
import Lang from "../../common/model/global/Lang";

interface RouteParam {
  uuid: string
}


interface IProps extends RouteComponentProps<RouteParam> {

}

interface IState {

}

export default class Detail extends TankComponent <IProps, IState> {

  //登录的那个用户
  user: User = Moon.getSingleton().user

  //当前页面正在编辑的用户
  currentUser: User = new User(this)

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }


  componentDidMount() {
    let that = this
    let match = this.props.match;
    this.currentUser.uuid = match.params.uuid;
    this.currentUser.httpDetail()
  }

  resetPassword() {
    let that = this

    SingleTextModal.open(Lang.t("user.enterNewPassword"), "", function (text: string) {
      that.currentUser.httpResetPassword(text, function (response: any) {
        MessageBoxUtil.success(Lang.t("operationSuccess"))
      })
    })

  }

  transfiguration() {

    let that = this
    let user: User = this.user
    let currentUser: User = this.currentUser
    TransfigurationModal.open(currentUser)

  }

  toggleStatus() {
    let that = this
    let user: User = this.user
    let currentUser: User = this.currentUser
    currentUser.httpToggleStatus(function () {
      MessageBoxUtil.success(Lang.t("operationSuccess"))
      that.updateUI()
    })
  }

  changePassword() {

    let that = this

    let user: User = this.user
    let currentUser: User = this.currentUser
    ChangePasswordModal.open(currentUser, function () {
      MessageBoxUtil.success(Lang.t("operationSuccess"))


    })

  }

  render() {

    let that = this

    let user: User = this.user
    let currentUser: User = this.currentUser

    return (

      <div className="page-user-detail">

        <TankTitle name={Lang.t("user.profile")}>

          {
            user.role === UserRole.ADMINISTRATOR && (
              <Button className='ml10' type="primary"
                      icon={<UnlockOutlined/>}
                      onClick={this.resetPassword.bind(this)}>
                {Lang.t("user.resetPassword")}
              </Button>
            )
          }

          {
            user.role === UserRole.ADMINISTRATOR && (
              <Button className='ml10' type="primary"
                      icon={<UserSwitchOutlined/>}
                      onClick={this.transfiguration.bind(this)}>
                {Lang.t("user.transfiguration")}
              </Button>
            )
          }

          {
            currentUser.uuid === user.uuid && (
              <Button className='ml10' type="primary" onClick={this.changePassword.bind(this)} icon={<UnlockOutlined/>}>
                {Lang.t("user.changePassword")}
              </Button>
            )
          }

          <Link to={'/user/edit/' + currentUser.uuid}>
            <Button className='ml10' type="primary" icon={<EditOutlined/>}>
              {Lang.t("edit")}
            </Button>
          </Link>

          {
            (user.role === UserRole.ADMINISTRATOR && currentUser.uuid !== user.uuid) && (
              <Button className='ml10' type="primary"
                      danger={currentUser.status === UserStatus.OK}
                      icon={<StopOutlined/>}
                      onClick={this.toggleStatus.bind(this)}>
                {currentUser.status === UserStatus.OK ? Lang.t("user.disable") : Lang.t("user.active")}
              </Button>
            )
          }

        </TankTitle>

        <TankContentCard loading={currentUser.detailLoading}>

          <div className="text-center mv20">
            <img className="avatar-large" alt="avatar" src={currentUser.getAvatarUrl()} onClick={() => {
              ImagePreviewer.showSinglePhoto(currentUser.getAvatarUrl(true))
            }}/>
            <div className="f24">
              {currentUser.username}
            </div>
          </div>


          <InfoCell name={Lang.t("user.role")}>
            <Tag color={UserRoleMap[currentUser.role].color}>{UserRoleMap[currentUser.role].name}</Tag>
          </InfoCell>


          <InfoCell name={Lang.t("user.singleFileSizeLimit")}>
            {FileUtil.humanFileSize(currentUser.sizeLimit)}
          </InfoCell>


          <InfoCell name={Lang.t("user.totalFileSizeLimit")}>
            {FileUtil.humanFileSize(currentUser.totalSizeLimit)}
          </InfoCell>


          <InfoCell name={Lang.t("user.totalFileSize")}>
            {FileUtil.humanFileSize(currentUser.totalSize)}
          </InfoCell>


          <InfoCell name={Lang.t("user.status")}>
            <Tag color={UserStatusMap[currentUser.status].color}>{UserStatusMap[currentUser.status].name}</Tag>
          </InfoCell>


          <InfoCell name={Lang.t("user.lastLoginIp")}>
            {currentUser.lastIp}
          </InfoCell>


          <InfoCell name={Lang.t("user.lastLoginTime")}>
            {DateUtil.simpleDateTime(currentUser.lastTime)}
          </InfoCell>

          <InfoCell name={Lang.t("user.webdavLink")}>
            {BrowserUtil.fullHost() + "/api/dav"}
          </InfoCell>

          {
            currentUser.role === UserRole.ADMINISTRATOR && (
              <InfoCell name={Lang.t("user.docLink")}>
                <a className="f14" href="https://tank-doc.eyeblue.cn" target="_blank">
                  https://tank-doc.eyeblue.cn
                </a>
              </InfoCell>
            )
          }

        </TankContentCard>


      </div>
    )
  }
}

