import History from '../pages/History/History';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import ScoreRecord from '../pages/ScoreRecord/ScoreRecord';
import FilterConditions from '../pages/ScoreRecord/FilterConditions';
import AbilitySelf from '../pages/AbilitySelf/AbilitySelf';
import Ability from '../pages/Ability/Ability';
import TaskList from '../pages/TaskList/TaskList';
import AbilityIntro from '../pages/Intro/AbilityIntro'; // 能力说明
import LevelIntro from '../pages/Intro/LevelIntro'; // 等级说明
import TaskDetails from '../pages/TaskDetails/TaskDetails'; // 任务详情

const Routes = {
  History: { screen: History },
  // 排行榜
  Leaderboard: { screen: Leaderboard },
  // 得分记录
  ScoreRecord: { screen: ScoreRecord },
  // 得分记录中筛选条件
  FilterConditions: { screen: FilterConditions },
  // 本人能力主页
  AbilitySelf: { screen: AbilitySelf },
  // 他人能力主页
  Ability: { screen: Ability },
  // 任务列表
  TaskList: { screen: TaskList },
  AbilityIntro: { screen: AbilityIntro },
  LevelIntro: { screen: LevelIntro },
  TaskDetails: { screen: TaskDetails },
};

export default Routes;
