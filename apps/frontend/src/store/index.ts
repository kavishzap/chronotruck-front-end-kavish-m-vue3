import { createStore } from "vuex";
import axios from "axios";
import { Truck } from "@/types/truck";

// Define the state interface
export interface State {
  trucks: Truck[];
}

export default createStore<State>({
  state: {
    trucks: [],
  },
  getters: {
    getTrucks: (state) => state.trucks,
  },
  mutations: {
    setTrucks(state, trucks: Truck[]) {
      state.trucks = trucks;
    },
    addTruck(state, truck: Truck) {
      state.trucks.push(truck);
    },
    updateTruck(state, updatedTruck: Truck) {
      const index = state.trucks.findIndex((t) => t._id === updatedTruck._id);
      if (index !== -1) state.trucks[index] = updatedTruck;
    },
    removeTruck(state, id: string) {
      state.trucks = state.trucks.filter((t) => t._id !== id);
    },
  },
  actions: {
    async fetchTrucks({ commit }) {
      const response = await axios.get("http://localhost:3000/trucks");
      commit("setTrucks", response.data);
    },
    async createTruck({ commit }, truck: Truck) {
      const response = await axios.post("http://localhost:3000/trucks", truck);
      commit("addTruck", response.data);
    },
    async updateTruck({ commit }, truck: Truck) {
      const response = await axios.put(
        `http://localhost:3000/trucks/${truck._id}`,
        truck
      );
      commit("updateTruck", response.data);
    },
    async deleteTruck({ commit }, id: string) {
      await axios.delete(`http://localhost:3000/trucks/${id}`);
      commit("removeTruck", id);
    },
  },
  modules: {},
});
