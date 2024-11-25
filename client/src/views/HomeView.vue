<template>
  <div>
    <h1>This is an home page</h1>
  </div>

  <button v-on:click="setParams(2020)">2020</button>
  <button v-on:click="setParams(2024)">2024</button>

  {{ books }}
</template>

<script setup>
import axios from "axios"
import { onMounted, ref, watch, onUpdated } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

let books = ref([])

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
})

let params = {
  year: 2014,
}

function setParams(year) {
  params.year = year
  console.log(params.year)
  router.push({ path: "/", query: { year: params.year } })
  console.log(params)
}

// router.afterEach((to, from) => {
//   axiosInstance.get("/books", { params }).then((res) => {
//     books.value = res.data
//     console.log(books.value)
//   })
// })
watch(
  () => route.query,
  (query) => {
    params.year = query.year
    console.log(params.year)
    axiosInstance.get("/books", { params }).then((res) => {
      books.value = res.data
      console.log(books.value)
    })
  }
)

onMounted(() => {
  console.log("home page mounted")
  axiosInstance.get("/books").then((res) => {
    books.value = res.data
    console.log(books.value)
  })
})
</script>
