export const killConsole = () => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
}

export const reviveConsole = () => {
  console.log.mockRestore()
  console.error.mockRestore()
  console.groupCollapsed.mockRestore()
}
