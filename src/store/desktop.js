export default {
  state: {
    modeGrid: true,
    countRows: 25,
    countColumns: 50,
    grid: [10, 5],
    widthGrid: 0,
    heightGrid: 0,
    widthWorkspace: 0,
    heightWorkspace: 0
  },
  mutations: {
    setWidthGrid(state, widthGrid) {
      state.widthGrid = widthGrid;
    },

    setHeightGrid(state, heightGrid) {
      state.heightGrid = heightGrid;
    },

    setWidthWorkspace(state, widthWorkspace) {
      state.widthWorkspace = widthWorkspace;
    },

    setHeightWorkspace(state, heightWorkspace) {
      state.heightWorkspace = heightWorkspace;
    },

    toggleModeGrid(state) {
      state.modeGrid = !state.modeGrid;
    }
  },

  getters: {
    getCountColumns(state) {
      return state.countColumns;
    },

    getCountRows(state) {
      return state.countRows;
    },

    getWidthGrid(state) {
      return state.widthGrid;
    },

    widthGrid(state) {
      return state.widthGrid;
    },

    getHeightGrid(state) {
      return state.heightGrid;
    },

    heightGrid(state) {
      return state.heightGrid;
    },

    isModeGrid(state) {
      return state.modeGrid;
    }
  }
};
