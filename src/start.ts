import { IAppInfo } from './types'
import { setAppList } from './appList/index'

export const registerMicroApps = (appList: IAppInfo[]) => {
    setAppList(appList);
};