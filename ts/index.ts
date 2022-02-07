import { EventListener } from './EventListener'
import { Task } from './Task'
import { TaskCollection } from './TaskCollection'
import { TaskRenderer } from './TaskRenderer'
class Application {
  private readonly eventListener = new EventListener()
  private readonly taskCollection = new TaskCollection()
  private readonly taskRenderer = new TaskRenderer(
    document.getElementById('todoList') as HTMLElement,
    document.getElementById('doingList') as HTMLElement,
    document.getElementById('doneList') as HTMLElement
  )
  start() {
    const createForm = document.getElementById('createForm') as HTMLElement
    this.eventListener.add('submit-handler', 'submit', createForm, this.handleSubmit)
    this.taskRenderer.subscribeDragAndDrop()
  }
  private handleSubmit = (e: Event) => {
    e.preventDefault()
    const titleInput = document.getElementById('title') as HTMLInputElement
    if (!titleInput.value) return

    const task = new Task({ title: titleInput.value })
    this.taskCollection.add(task)
    const { deleteButtonEl } = this.taskRenderer.append(task)
    this.eventListener.add(
      task.id, 'click', deleteButtonEl, () => this.handleClickDeleteTask(task)
    )

    titleInput.value = ''
  }
  private handleClickDeleteTask = (task: Task) => {
    if (!window.confirm(`${task.title} delete?`)) return
    this.eventListener.remove(task.id)
    this.taskCollection.delete(task)
    this.taskRenderer.remove(task)
    console.log(this.taskCollection)
  }
}
window.addEventListener('load', () => {
  const app = new Application()
  app.start()
})