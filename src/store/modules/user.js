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
    roles: [],
    routers: constantRoutes,
    addRouters: [],
    tRouters: constantRoutes,
    addTRouters: []
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
    LOGOUT: (state) => {
      state.addRouters = [];
      state.routers = [];
      state.tRouters = [],
      state.addTRouters = [],
      state.name = '';
      state.roles = [];
      state.token = '';
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
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
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
          commit('SET_ROUTERS', routerFormat(data[0]))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取二级权限
    GetTRole({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
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
                },
                {
                  "path": "grade",
                  "name": "grade",
                  "component": "school_port/student/student_grade_manager",
                  "meta": {
                    "title": "学生成绩列表"
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
        // getTRole(state.token).then(response => {
          commit('SET_T_ROUTERS', routerFormat(data[0]))
          // resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
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
                  },
                  {
                    "path": "grade",
                    "name": "grade",
                    "component": "school_port/student/student_grade_manager",
                    "meta": {
                      "title": "学生成绩列表"
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
                    "component": "business_port/teaching/teaching_manager",
                    "redirect": "/teaching/plan/manager",
                    "meta": {
                      "title": "教学计划管理",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/teaching/plan/manager",
                        "name": "manager",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "教学计划列表"
                        }
                      },
                      {
                        "path": "asd",
                        "name": "asd",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "制定教学计划"
                        }
                      },
                      {
                        "path": "aaa",
                        "name": "aaa",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "勋章管理"
                        }
                      }
                    ]
                  }
                ]
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
                    "component": "business_port/teaching/teaching_manager",
                    "redirect": "/student/attend/plan",
                    "meta": {
                      "title": "学生上课资料",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/student/attend/plan",
                        "name": "plan",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "学生教学计划"
                        }
                      },
                      {
                        "path": "/student/attend/asd",
                        "name": "asd",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "学生签到"
                        }
                      },
                      {
                        "path": "/student/attend/aaa",
                        "name": "aaa",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "学生成绩列表"
                        }
                      },
                      {
                        "path": "/student/attend/asc",
                        "name": "asc",
                        "component": "business_port/teaching/teaching_manager",
                        "meta": {
                          "title": "学生积分余额"
                        }
                      }
                    ]
                  },
                  {
                    "path": "/student/roll",
                    "component": "business_port/teaching/teaching_manager",
                    "redirect": "/student/roll/manager",
                    "meta": {
                      "title": "学生学籍资料",
                      "icon": "plane"
                    },
                    "children": [
                      {
                        "path": "/student/roll/manager",
                        "name": "manager",
                        "component": "business_port/teaching/teaching_manager",
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
                "meta": {
                  "title": "合作单位",
                  "icon": "plane"
                }
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
          commit('SET_ROLES', '2')
          commit('SET_AVATAR', 'data.avatar')
          // commit('SET_ROUTERS', routerFormat(data.routers))
          commit('SET_ROUTERS', routerFormat(json3.router))
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
