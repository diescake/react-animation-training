import React, { FC, useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react'
import { connect } from 'react-redux'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { logout, LoginDispatcher } from '@/app/actions/login'
import { addTodo, updateTodo, deleteTodo, fetchTodos, TodoDispatcher } from '@/app/actions/todo'
import { TodoItem } from '@/app/components/TodoItem'
import { ListWrapper } from '@/app/components/ListWrapper'
import { Modal } from '@/app/components/Modal'
import { Footer } from '@/app/components/Footer'

import { RootState } from '@/app/models'
import { Todo } from '@/app/models/Todo'
import words from '@/assets/strings'
import style from '@/app/containers/TodoApp/style.scss'

interface StateProps {
  readonly todos: Todo[]
  readonly userId: string
  readonly fetching: boolean
}

interface DispatchProps {
  readonly addTodo: TodoDispatcher['addTodo']
  readonly updateTodo: TodoDispatcher['updateTodo']
  readonly deleteTodo: TodoDispatcher['deleteTodo']
  readonly fetchTodos: TodoDispatcher['fetchTodos']
  readonly logout: LoginDispatcher['logout']
}

type TodoAppProps = StateProps & DispatchProps

const mapStateToProps = (state: RootState): StateProps => ({
  todos: state.todoState.todos,
  fetching: state.todoState.fetching,
  userId: state.loginState.userId,
})

const mapDispatchToProps = {
  addTodo,
  updateTodo,
  deleteTodo,
  fetchTodos,
  logout,
}

const TodoApp: FC<TodoAppProps> = (props: TodoAppProps) => {
  const [text, setText] = useState<string>('')
  const [modalHidden, setModalHidden] = useState<boolean>(true)
  const inputElem = useRef<HTMLInputElement>(null)

  useEffect(() => {
    props.fetchTodos()
  }, [])

  const addTodo = () => {
    if (!text) {
      return
    }
    props.addTodo(text)
    setText('')
    setModalHidden(true)
  }

  const handleFetchTodos = () => props.fetchTodos()
  const handleLogout = () => props.logout()
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)
  const handleAddTodoClick = () => addTodo()

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleCheckBoxClick = (todo: Todo) => props.updateTodo({ ...todo, done: !todo.done })
  const handleDeleteClick = (todo: Todo) => props.deleteTodo(todo.id)

  const modalOpen = () => {
    setText('')
    setModalHidden(false)
  }

  const modalClose = () => {
    setText('')
    setModalHidden(true)
  }

  const handleModalLoad = () => {
    if (inputElem.current) {
      inputElem.current.focus()
    }
  }

  return (
    <div className={style.container}>
      <div>
        <button type="button" className={style.fetchButton} disabled={props.fetching} onClick={handleFetchTodos}>
          {words.todoApp.fetchTodos}
        </button>
        <button type="button" className={style.addButton} onClick={modalOpen}>
          {words.todoApp.newTodo}
        </button>
        <button type="button" className={style.logoutButton} onClick={handleLogout}>
          {words.todoApp.logout}
        </button>
      </div>
      <Modal hidden={modalHidden} onLoad={handleModalLoad} icon={faPlusCircle} name={words.todoApp.newTodo} close={modalClose}>
        <input
          ref={inputElem}
          className={style.inputTodo}
          type="text"
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={words.todoApp.placeholder}
          value={text}
        />
        <br />
        <button type="button" className={style.postButton} disabled={!text || props.fetching} onClick={handleAddTodoClick}>
          {words.todoApp.addTodo}
        </button>
      </Modal>

      <div className={style.listWrapper1}>
        <h2>react-transition-group</h2>
        <ListWrapper loading={props.fetching}>
          <TransitionGroup>
            {props.todos.map((todo: Todo) => (
              <CSSTransition
                key={todo.id}
                timeout={{ appear: 200, enter: 200, exit: 200 }}
                appear
                classNames={{
                  appear: style.todoItemAppear,
                  appearActive: style.todoItemAppearActive,
                  enter: style.todoItemEnter,
                  enterActive: style.todoItemEnterActive,
                  exit: style.todoItemExit,
                  exitActive: style.todoItemExitActive,
                }}
              >
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleCheckBoxClick={handleCheckBoxClick}
                  handleDeleteClick={handleDeleteClick}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListWrapper>
      </div>

      <div className={style.listWrapper2}>
        <h2>An other library (not implemented)</h2>
        <ListWrapper loading={props.fetching}>
          {props.todos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} handleCheckBoxClick={handleCheckBoxClick} handleDeleteClick={handleDeleteClick} />
          ))}
        </ListWrapper>
      </div>

      <div className={style.listWrapper3}>
        <h2>No animations</h2>
        <ListWrapper loading={props.fetching}>
          {props.todos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} handleCheckBoxClick={handleCheckBoxClick} handleDeleteClick={handleDeleteClick} />
          ))}
        </ListWrapper>
      </div>
      <Footer />
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
