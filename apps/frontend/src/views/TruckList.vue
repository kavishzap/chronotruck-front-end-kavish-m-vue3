<template>
  <div>
    <h2>My Trucks</h2>
    <div v-if="!trucks.length" class="empty-message">No truck added yet.</div>
    <div v-else class="truck-list">
      <div v-for="truck in trucks" :key="truck._id" class="truck-card">
        <button class="delete" @click="deleteTruck(truck._id)">×</button>
        <p class="plate">{{ truck.licensePlate }}</p>
        <p>{{ truck.length }}x{{ truck.width }} cm</p>
        <p>Max {{ truck.maxWeight }}kg</p>
        <button class="edit" @click="openEdit(truck)">Edit</button>
      </div>
    </div>

    <EditTruckModal
      v-if="isModalOpen"
      :visible="isModalOpen"
      :data="selectedTruck"
      @close="closeModal"
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";
import EditTruckModal from "../components/EditTruckModal.vue";
import { Truck } from "@/types/truck";

const store = useStore();
const trucks = computed(() => store.state.trucks);

const isModalOpen = ref(false);
const selectedTruck = ref<Truck | null>(null);

onMounted(() => {
  store.dispatch("fetchTrucks");
});

const deleteTruck = async (id: string) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This truck will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirm.isConfirmed) {
    Swal.fire({
      title: "Deleting...",
      text: "Please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await store.dispatch("deleteTruck", id);
      Swal.fire("Deleted!", "The truck has been removed.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete truck. Try again.", "error");
    }
  }
};

const openEdit = (truck: Truck) => {
  selectedTruck.value = { ...truck };
  isModalOpen.value = true;
};

const handleUpdated = () => {
  store.dispatch("fetchTrucks");
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.truck-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.truck-card {
  background: #c2c2c2;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 1rem;
  width: 180px;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.truck-card .delete {
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 1.2rem;
  cursor: pointer;
}

.truck-card .plate {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.empty-message {
  color: #555;
  font-style: italic;
  padding: 1rem;
}

.edit {
  margin-top: 0.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.edit:hover {
  background-color: #1d4ed8;
}
</style>
