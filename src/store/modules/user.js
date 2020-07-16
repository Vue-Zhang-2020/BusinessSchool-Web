import {
  login,
  logout,
  getInfo,
  getTRole
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import routerFormat from '@/utils/z-router'
import {
  constantRoutes,
  notFoundRouter
} from '@/router';
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    schoolId: '',
    roles: [],
    routers: constantRoutes,
    addRouters: [],
    tRouters: constantRoutes,
    addTRouters: [],
    pathRouter: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_SCHOOL_ID: (state, schoolId) => {
      state.schoolId = schoolId
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers; //路由访问
      state.routers = constantRoutes.concat(routers).concat(notFoundRouter); //菜单显示,404最后加入
    },
    SET_T_ROUTERS: (state, routers) => {
      state.tRouters = constantRoutes.concat(routers).concat(notFoundRouter); //菜单显示,404最后加入
    },
    SET_PATH_ROUTER: (state, paths) => {
      state.pathRouter = paths
    },
    LOGOUT: (state) => {
      state.addRouters = [];
      state.routers = [];
      state.tRouters = [],
      state.addTRouters = [],
      state.name = '';
      state.roles = [];
      state.token = '';
      state.pathRouter = ''
    },
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          console.log(parseInt(data[0].scnameid))
          setToken(data[0].api_token)
          commit('SET_TOKEN', data[0].api_token)
          commit('SET_SCHOOL_ID', parseInt(data[0].scnameid))
          sessionStorage.setItem('schoolId', parseInt(data[0].scnameid))
          resolve(response)
        }).catch(error => {
          reject('错误' + error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_NAME', '张三')
          commit('SET_ROLES', 'data.roles')
          commit('SET_AVATAR', 'data.avatar')
          commit('SET_SCHOOL_ID', '1')
          commit('SET_ROUTERS', routerFormat(data[0]))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetInfoss({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        // getInfo(state.token).then(response => {
          let json = {
            "router": [
              {
                "path": "/school",
                "component": "Layout",
                "meta": {
                  "title": "学校管理",
                  "icon": "school"
                },
                "children": [
                  {
                    "path": "info",
                    "name": "info",
                    "component": "school_port/school/school_info",
                    "meta": {
                      "title": "学校信息"
                    }
                  },
                  {
                    "path": "major",
                    "name": "major",
                    "component": "school_port/school/school_major_manager",
                    "meta": {
                      "title": "学校专业管理"
                    }
                  },
                  {
                    "path": "class",
                    "name": "class",
                    "component": "school_port/school/school_class_manager",
                    "meta": {
                      "title": "学校班级管理"
                    }
                  }
                ]
              },
              {
                "path": "/student",
                "component": "Layout",
                "meta": {
                  "title": "学生资料",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "info",
                    "name": "info",
                    "component": "school_port/student/student_info_manager",
                    "meta": {
                      "title": "学生资料管理"
                    }
                  }
                ]
              },
              {
                "path": "/campus",
                "component": "Layout",
                "meta": {
                  "title": "校园头条中心",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "head",
                    "name": "head",
                    "component": "school_port/campus/campus_head_center",
                    "meta": {
                      "title": "校园头条中心"
                    }
                  }
                ]
              },
              {
                "path": "/dynamic",
                "component": "Layout",
                "meta": {
                  "title": "动态中心",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "center",
                    "name": "center",
                    "component": "school_port/dynamic/dynamic_center",
                    "meta": {
                      "title": "动态中心"
                    }
                  }
                ]
              }
            ]
          }
          let json2 = {
            "router": [
              {
                "path": "/firm",
                "component": "Layout",
                "meta": {
                  "title": "教学计划",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "program",
                    "name": "program",
                    "component": "firm_port/teaching_plan_view",
                    "meta": {
                      "title": "教学计划查看"
                    }
                  }
                ]
              }
            ]
          }
          let json3 = {
            "router": [
              {
                "path": "/home",
                "component": "Layout",
                "redirect": "/home/home",
                "meta": {
                  "title": "首页",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "/home/home",
                    "component": "business_port/home/home",
                    "meta": {
                      "title": "",
                      "icon": ""
                    },
                  }
                ]
              },
              {
                "path": "/teaching",
                "component": "Layout",
                "redirect": "/teaching/plan",
                "meta": {
                  "title": "教学管理",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "/teaching/plan",
                    "component": "RouterView",
                    "redirect": "/teaching/plan/enact",
                    "meta": {
                      "title": "教学计划管理",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/teaching/plan/list",
                        "name": "list",
                        "component": "business_port/teaching/teaching_plan/teaching_plan_list",
                        "meta": {
                          "title": "教学计划列表"
                        }
                      },
                      {
                        "path": "/teaching/plan/enact",
                        "name": "enact",
                        "component": "business_port/teaching/teaching_plan/teaching_enact_plan",
                        "meta": {
                          "title": "制定教学计划"
                        }
                      },
                      {
                        "path": "/teaching/plan/medal",
                        "name": "medal",
                        "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                        "meta": {
                          "title": "勋章管理"
                        }
                      }
                    ]
                  },
                  {
                    "path": "/teaching/course",
                    "component": "RouterView",
                    "redirect": "/teaching/course/center",
                    "meta": {
                      "title": "课程管理",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/teaching/course/center",
                        "name": "center",
                        "component": "business_port/teaching/course_manager/course_center",
                        "meta": {
                          "title": "课程中心"
                        }
                      },
                      {
                        "path": "/teaching/course/type",
                        "name": "type",
                        "component": "business_port/teaching/course_manager/course_type",
                        "meta": {
                          "title": "课程分类"
                        }
                      }
                    ]
                  },
                  {
                    "path": "/teaching/exam",
                    "component": "RouterView",
                    "redirect": "/teaching/exam/center",
                    "meta": {
                      "title": "考试管理",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/teaching/exam/center",
                        "name": "center",
                        "component": "business_port/teaching/exam_manager/exam_center",
                        "meta": {
                          "title": "考试中心"
                        }
                      }
                    ]
                  }
                ],
              },
              {
                "path": "/student",
                "component": "Layout",
                "redirect": "/student/attend",
                "meta": {
                  "title": "学生资料",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "/student/attend",
                    "component": "RouterView",
                    "redirect": "/student/attend/plan",
                    "meta": {
                      "title": "学生上课资料",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/student/attend/plan",
                        "name": "plan",
                        "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                        "meta": {
                          "title": "学生教学计划"
                        }
                      },
                      {
                        "path": "/student/attend/asd",
                        "name": "asd",
                        "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                        "meta": {
                          "title": "学生签到"
                        }
                      },
                      {
                        "path": "/student/attend/aaa",
                        "name": "aaa",
                        "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                        "meta": {
                          "title": "学生成绩列表"
                        }
                      },
                      {
                        "path": "/student/attend/asc",
                        "name": "asc",
                        "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                        "meta": {
                          "title": "学生积分余额"
                        }
                      }
                    ]
                  },
                  {
                    "path": "/student/roll",
                    "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                    "redirect": "/student/roll/manager",
                    "meta": {
                      "title": "学生学籍资料",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/student/roll/manager",
                        "name": "manager",
                        "component": "business_port/teaching/teaching_plan/teaching_medal_manager",
                        "meta": {
                          "title": "学生学籍管理"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "path": "/unit",
                "component": "Layout",
                "redirect": "/unit/firm",
                "meta": {
                  "title": "合作单位",
                  "icon": "plane"
                },
                "children": [
                  {
                    "path": "/unit/firm",
                    "component": "RouterView",
                    "redirect": "/unit/firm/coop",
                    "meta": {
                      "title": "企业单位管理",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/unit/firm/coop",
                        "name": "coop",
                        "component": "business_port/unit/cooperator_unit",
                        "meta": {
                          "title": "合作企业列表"
                        }
                      },
                      {
                        "path": "/unit/firm/school",
                        "name": "school",
                        "component": "business_port/unit/cooperator_school",
                        "meta": {
                          "title": "合作学校列表"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "path": "/bus",
                "component": "Layout",
                "meta": {
                  "title": "商管院管理",
                  "icon": "plane"
                }
              },
              {
                "path": "/system",
                "component": "Layout",
                "meta": {
                  "title": "系统设置",
                  "icon": "plane"
                }
              }
            ]
          }
          // let tRouters = []
          // json3.router.forEach(element => {
          //   if (element.children) {  
          //     tRouters.push(...element.children)
          //   }
          // });
          // console.log(tRouters)
          // const data = response.data
          commit('SET_NAME', 'data.name')
          commit('SET_ROLES', sessionStorage.getItem('roles'))
          commit('SET_AVATAR', 'data.avatar')
          // commit('SET_SCHOOL_ID', 1)
          // commit('SET_ROUTERS', routerFormat(data.routers))
          console.log(sessionStorage.getItem('roles'))
          commit('SET_ROUTERS', routerFormat(
            sessionStorage.getItem('roles') === '1' ? json.router 
            : sessionStorage.getItem('roles') === '2' ? json3.router : json2.router))
          // commit('SET_T_ROUTERS', tRouters)
          resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('LOGOUT', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('LOGOUT', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
