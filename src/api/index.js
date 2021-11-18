import basicData from './modules/basicData.js'
import dna from './modules/dna.js'
import common from './modules/common.js'
import caseManagement from './modules/caseManagement.js'
import clientManagement from './modules/clientManagement.js'
import financialManagement from './modules/financialManagement.js'
import processManagement from './modules/processManagement.js'
import staffManagement from './modules/staffManagement.js'
import systemSettings from './modules/systemSettings.js'
import templateManagement from './modules/templateManagement.js'
import dataStatistics from './modules/dataStatistics.js'
import login from './modules/login.js'
import myDashboard from './modules/myDashboard.js'
import report from './modules/report.js'
import myCenter from './modules/myCenter.js'
import flow from './modules/flow.js'
import mainFlow from './modules/mainFlow.js'


export default{
    ...login,
    ...myDashboard,
    ...common,
    ...caseManagement,
    ...dataStatistics,
    ...financialManagement,
    ...processManagement,
    ...staffManagement,
    ...systemSettings,
    ...basicData,
    ...templateManagement,
    ...clientManagement,
    ...report,
    ...myCenter,
    ...dna,
    ...flow,
    ...mainFlow

}
