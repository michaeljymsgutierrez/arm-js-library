const Controller = (props) => {
  const onClickEdit = (id) => {
    console.log('Clicked edit')
  }
  const onClickNew = () => {
    console.log('Clicked new')
  }

  return { onClickEdit, onClickNew }
}

export default Controller
