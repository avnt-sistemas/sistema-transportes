export const setFocus = (fieldName: string, callback?: any): void => {
  const inputs = document.getElementsByTagName('input')

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute('name') === fieldName) {
      inputs[i].focus()
      if (callback) callback(inputs[i])
      break
    }
  }
}

export const setBlur = (fieldName: string, callback?: any): void => {
  const inputs = document.getElementsByTagName('input')

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute('name') === fieldName) {
      inputs[i].blur()
      if (callback) callback(inputs[i])
      break
    }
  }
}
