import { useState } from 'react'
import axios from 'axios'
import slugify from 'react-slugify'

export default function AddImages(props) {


  async function postImage({image}) {
    const formData = new FormData();
    formData.append("image", image)
  
    const result = await axios.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
    return result.data
  }

  const [file, setFile] = useState()
  const [imageTitle, setImageTitle] = useState('')
  const [year, setYear] = useState('')
  const [images, setImages] = useState([])


  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)
	}

  const submit = async (e) => {
    e.preventDefault()

    const result = await postImage({image: file})
    setImages([result.image, ...images])
    
    const selector = document.querySelector("#projectID")
    
    const projectID = selector.options[selector.selectedIndex].value
    
    console.log(projectID)
    
    await axios
      .post('/api/images', {
        image_title: imageTitle,
        year: year,  
        image_url: '/images/' + (file.name).replaceAll(/[\s*+~()'"!:@]/g, '-'),
        project_id: projectID
    })
  }

  return (
  
    <div className="form-container">

      <form onSubmit={ submit } >

        <label>Add Image: </label>
        <select id="projectID" onChange={ props.handleChange } name="title">
          <option >Select Project:</option>
          {
            props.projects.map((project) => (
              <option key={ project._id } value={ project._id } >{ project.title }</option>
            ))
          }
        </select>

        <input onChange={ fileSelected } type="file" accept="image/*"></input>
        <input value={ imageTitle } onChange={e => setImageTitle(e.target.value) } type="text" placeholder="Image Title" />
        <input value={ year } onChange={e => setYear(e.target.value)} type="text" placeholder="Year" />
        
        <button type="submit">Add</button>
      </form>
      
    </div>
    
  )
}