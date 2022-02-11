import { Status, Task, TaskObject } from "./Task";
const STORAGE_KEY = 'TASKS'
export class TaskCollection {
  private readonly storage
  private tasks: Task[] = []
  constructor() {
    this.storage = localStorage
    this.tasks = this.getStoredTasks()
  }
  add(task: Task) {
    this.tasks.push(task)
    this.updateStorage()
  }
  delete(task: Task) {
    this.tasks = this.tasks.filter(({ id }) => id !== task.id)
    this.updateStorage()
  }
  find(id: string) {
    return this.tasks.find((task) => task.id === id)
  }
  update(task: Task) {
    this.tasks = this.tasks.map((item) => {
      if (item.id === task.id) return task
      return item
    })
  }
  filter(filterStatus: Status) {
    return this.tasks.filter(({ status }) => status === filterStatus)
  }
  private updateStorage() {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
  }
  private getStoredTasks(): Task[] {
    const jsonString = this.storage.getItem(STORAGE_KEY)
    if (!jsonString) return []

    try {
      const storedTasks = JSON.parse(jsonString)
      this.assertIsTaskObjects(storedTasks)
      const tasks = storedTasks.map((task) => new Task(task))
      console.log(tasks)
      return tasks
    } catch {
      this.storage.removeItem(STORAGE_KEY)
      return []
    }
  }
  assertIsTaskObjects(value: any): asserts value is TaskObject[] {
    if (!Array.isArray(value) || !value.every((item) => Task.validate(item))) {
      throw new Error('value is not matched TaskObject[]')
    }
  }
}