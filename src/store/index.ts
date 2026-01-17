import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useSelector} from 'react-redux'

type state = {
  sidebarShow: boolean
  sidebarUnfoldable: boolean
  asideShow: boolean
  theme: string,
  resetData: boolean
}

const initialState: state = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  asideShow: false,
  theme: 'dark',
  resetData: false
}

type args = { type: string; [key: string]: boolean | string }

const changeState = (state = initialState, {type, ...rest}: args) => {
  switch (type) {
    case 'set':
      return {...state, ...rest}
    default:
      return state
  }
}

export function makeStore() {
  return configureStore({
    reducer: changeState,
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store

export const useTypedSelector: TypedUseSelectorHook<state> = useSelector
