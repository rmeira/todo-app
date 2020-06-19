export const state = () => {
  return {
    profile: {
      name: '',
      avatar: '',
    },
  }
}

export const actions = {
  setProfile({ commit }, data) {
    commit('SET_PROFILE', data)
  },
}

export const mutations = {
  SET_PROFILE(state, data) {
    state.profile = data
  },
}

export const getters = {
  profile: (state) => state.profile,
}
