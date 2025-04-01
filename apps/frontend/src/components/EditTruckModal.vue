<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <h3>Edit Truck</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>License Plate</label>
          <input v-model="licensePlate" />
          <p class="field-error" v-if="licensePlateError">
            {{ licensePlateError }}
          </p>
        </div>

        <div class="form-group">
          <label>Width (cm)</label>
          <input v-model.number="width" />
          <p class="field-error" v-if="widthError">{{ widthError }}</p>
        </div>

        <div class="form-group">
          <label>Length (cm)</label>
          <input v-model.number="length" />
          <p class="field-error" v-if="lengthError">{{ lengthError }}</p>
        </div>

        <div class="form-group">
          <label>Max Weight (kg)</label>
          <input v-model.number="maxWeight" />
          <p class="field-error" v-if="maxWeightError">{{ maxWeightError }}</p>
        </div>

        <div class="actions">
          <button type="submit">Update</button>
          <button type="button" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import Swal from "sweetalert2";
import { Truck } from "@/types/truck";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { reactive, watch } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

// eslint-disable-next-line no-undef
const props = defineProps<{ visible: boolean; data: Truck | null }>();
// eslint-disable-next-line no-undef
const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated"): void;
}>();

const store = useStore();

const schema = yup.object({
  licensePlate: yup
    .string()
    .matches(
      /^(?!ss|ww|.[iou]|[iou].)[a-z]{2}[-\s]?\d{3}[-\s]?(?!ss|ww|.[iou]|[iou].)[a-z]{2}$/i,
      "Invalid license plate format"
    )
    .required("License plate is required"),

  width: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : Number(originalValue)
    )
    .typeError("Width must be a number")
    .min(1)
    .max(240)
    .required("Width is required"),

  length: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : Number(originalValue)
    )
    .typeError("Length must be a number")
    .min(1)
    .max(1320)
    .required("Length is required"),

  maxWeight: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : Number(originalValue)
    )
    .typeError("Max weight must be a number")
    .min(1)
    .max(28000)
    .required("Max weight is required"),
});

// Form Setup
const { handleSubmit, setValues } = useForm<Truck>({
  validationSchema: schema,
});

const { value: licensePlate, errorMessage: licensePlateError } =
  useField<string>("licensePlate");
const { value: width, errorMessage: widthError } = useField<number>("width");
const { value: length, errorMessage: lengthError } = useField<number>("length");
const { value: maxWeight, errorMessage: maxWeightError } =
  useField<number>("maxWeight");

watch(
  () => props.data,
  (val) => {
    if (val) {
      setValues({
        licensePlate: val.licensePlate,
        width: val.width,
        length: val.length,
        maxWeight: val.maxWeight,
        _id: val._id,
      });
    }
  },
  { immediate: true }
);

const submitForm = handleSubmit(async (values) => {
  try {
    await store.dispatch("updateTruck", { ...values, _id: props.data?._id });
    Swal.fire("Updated!", "Truck details updated successfully.", "success");
    emit("updated");
    emit("close");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to update truck.", "error");
  }
});

const close = () => emit("close");
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.2s ease-in-out;
  font-family: "Segoe UI", sans-serif;
}

.modal h3 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: #374151;
}

input {
  padding: 0.55rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.field-error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button[type="submit"] {
  background-color: #3b82f6;
  color: #fff;
}

button[type="submit"]:hover {
  background-color: #2563eb;
}

button[type="button"] {
  background-color: #e5e7eb;
  color: #374151;
}

button[type="button"]:hover {
  background-color: #d1d5db;
}

@keyframes fadeIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
