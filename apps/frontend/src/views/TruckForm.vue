<template>
  <form @submit.prevent="submitForm" class="truck-form">
    <div class="input-group">
      <div class="field">
        <label for="plate">License Plate</label>
        <input id="plate" v-model="licensePlate" />
        <p class="field-error">{{ licensePlateError }}</p>
      </div>
      <div class="field">
        <label for="width">Width (cm)</label>
        <input id="width" v-model.number="width" />
        <p class="field-error">{{ widthError }}</p>
      </div>
      <div class="field">
        <label for="length">Length (cm)</label>
        <input id="length" v-model.number="length" />
        <p class="field-error">{{ lengthError }}</p>
      </div>
      <div class="field">
        <label for="weight">Max Weight (kg)</label>
        <input id="weight" v-model.number="maxWeight" />
        <p class="field-error">{{ maxWeightError }}</p>
      </div>

      <button type="submit">Add</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import Swal from "sweetalert2";

// Store
const store = useStore();

// Define validation schema
const schema = yup.object({
  licensePlate: yup
    .string()
    .matches(
      /^(?!ss|ww|.[iou]|[iou].)[a-z]{2}[-\s]?\d{3}[-\s]?(?!ss|ww|.[iou]|[iou].)[a-z]{2}$/i,
      "Invalid license plate format"
    )
    .required("Required"),
  width: yup
    .number()
    .required("Required")
    .min(1)
    .max(240, "Max width is 240cm"),
  length: yup
    .number()
    .required("Required")
    .min(1)
    .max(1320, "Max length is 1320cm"),
  maxWeight: yup
    .number()
    .required("Required")
    .min(1)
    .max(28000, "Max weight is 28000kg"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: licensePlate, errorMessage: licensePlateError } =
  useField("licensePlate");
const { value: width, errorMessage: widthError } = useField("width");
const { value: length, errorMessage: lengthError } = useField("length");
const { value: maxWeight, errorMessage: maxWeightError } =
  useField("maxWeight");

const submitForm = handleSubmit(async (values) => {
  try {
    await store.dispatch("createTruck", values);
    Swal.fire("Success", "Truck added successfully!", "success");
    resetForm();
  } catch (err) {
    Swal.fire("Error", "Failed to add truck. Please check the API.", "error");
    console.error(err);
  }
});
</script>

<style scoped>
.truck-form {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  flex: 1;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  height: 42px;
  align-self: flex-end;
}

button:hover {
  background-color: #2563eb;
}

.field-error {
  color: crimson;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
