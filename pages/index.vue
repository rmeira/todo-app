<template>
  <v-main>
    <v-container>
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="form.id ? handleUpdateTask() : handleCreateTask()"
      >
        <v-card class="mb-2">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>
              {{ form.id ? 'Atualizar tarefa' : 'Nova tarefa' }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert type="error" v-if="error">
              {{ error }}
            </v-alert>
            <v-text-field
              v-model="form.title"
              label="Titulo tarefa"
              outlined
              :rules="rules.title"
            />
            <v-textarea v-model="form.description" label="Descrição" outlined />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" color="orange" :disabled="!valid">
              {{ form.id ? 'Atualizar tarefa' : 'Criar tarefa' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      <v-card>
        <v-list>
          <v-subheader>Pendencia de tarefas</v-subheader>
          <v-divider />
          <v-list-item v-for="(task, index) in tasks" :key="index">
            <v-list-item-action>
              <v-checkbox
                :input-value="task.completed_at ? 1 : 0"
                color="primary"
                @change="handleCompleteTask(task)"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle>{{
                task.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon color="blue" small @click="handleEditTask(task)">
                <v-icon small>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn icon color="red" small @click="handleDeleteTask(task)">
                <v-icon small>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      valid: false,
      form: {
        title: '',
        description: '',
        username: '',
      },
      rules: {
        title: [(v) => !!v || 'Titulo é um campo obrigatório'],
      },
      error: '',
      tasks: [],
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/profile',
    }),
  },
  mounted() {
    if (!localStorage.getItem('token')) this.$router.push('/login')
    this.handleGetTasks()
  },
  methods: {
    async handleGetTasks() {
      await this.$axios
        .get(`${process.env.apiPortal}/v1/tasks`, {
          headers: {
            Authorization: `${localStorage.getItem(
              'token_type'
            )} ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          this.tasks = response.data
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    async handleCreateTask() {
      await this.$axios
        .post(`${process.env.apiPortal}/v1/tasks`, this.form, {
          headers: {
            Authorization: `${localStorage.getItem(
              'token_type'
            )} ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          this.tasks.push(response.data)
          this.handleClearForm()
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    handleEditTask(task) {
      this.form = task
    },
    async handleCompleteTask(task) {
      task.completed_at
        ? (task.completed_at = null)
        : (task.completed_at = new Date())
      await this.$axios
        .put(`${process.env.apiPortal}/v1/tasks/${task.id}`, task, {
          headers: {
            Authorization: `${localStorage.getItem(
              'token_type'
            )} ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          this.handleGetTasks()
          this.handleClearForm()
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    async handleUpdateTask() {
      await this.$axios
        .put(`${process.env.apiPortal}/v1/tasks/${this.form.id}`, this.form, {
          headers: {
            Authorization: `${localStorage.getItem(
              'token_type'
            )} ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          this.handleGetTasks()
          this.handleClearForm()
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    async handleDeleteTask(task) {
      await this.$axios
        .delete(`${process.env.apiPortal}/v1/tasks/${task.id}`, {
          headers: {
            Authorization: `${localStorage.getItem(
              'token_type'
            )} ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          this.handleGetTasks()
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    handleClearForm() {
      this.form = {
        title: '',
        description: '',
        username: this.profile.username,
      }
      this.$refs.form.resetValidation()
    },
  },
  watch: {
    'profile.username': function () {
      this.form.username = this.profile.username
    },
  },
}
</script>

<style></style>
