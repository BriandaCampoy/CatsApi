const api = axios.create({
  baseURL:'https://api.thecatapi.com/v1'
})
api.defaults.headers.common['X-API-KEY']= 'live_ql7ZHIc6XZdURLLBjqBQB335f4SxGwO8ozHeX8SBJnZGbi9PsL8T2GnJmkmy6iam';

const URL_Random =
  'https://api.thecatapi.com/v1/images/search?limit=5';
const URL_Favorites = 'https://api.thecatapi.com/v1/favourites?limit=20';
const URL_Delete_Favorites = (id) =>
`https://api.thecatapi.com/v1/favourites/${id}`;
const URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
 
const spanError = document.getElementById('error');

const getRandomCats = async () => {
  const response = await fetch(URL_Random);
  if (response.status !== 200) {
    spanError.innerHTML = 'Hubo un error ' + response.status;
  } else {
    const data = await response.json();
    const section = document.getElementById('randomMichis');
    section.innerHTML = '';
    data.forEach((michi) => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      // console.log(michi);
      btn.addEventListener('click', () => {
        saveFavoritesCats(michi.id);
      });
      const btnText = document.createTextNode('guardar al michi en favoritos');
      btn.appendChild(btnText);
      img.src = michi.url;
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    });
  }
};

const getFavoritesCats = async () => {
  const response = await fetch(URL_Favorites, {
    method: 'GET',
    headers: {
      'x-api-key':
      'live_ql7ZHIc6XZdURLLBjqBQB335f4SxGwO8ozHeX8SBJnZGbi9PsL8T2GnJmkmy6iam'
    }
  });
  if (response.status !== 200) {
    spanError.innerHTML = 'Hubo un error ' + response.status;
  } else {
    const data = await response.json();
    // console.log(data);
    const section = document.getElementById('favoritesMichis');
    section.innerHTML = '';
    data.forEach((michi) => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al michi de favoritos');
      btn.addEventListener('click', () => {
        deleteFavoriteMichi(michi.id);
      });
      btn.appendChild(btnText);
      img.src = michi.image.url;
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    });
    // const michiFavorite = document.getElementById('imgGatoFavorito');
    // michiFavorite.src = data[0].image.url
  }
};

const saveFavoritesCats = async (id) => {
  /** Sin axios */
  // console.log(id);
  // const response = await fetch(URL_Favorites, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key':
  //       'live_ql7ZHIc6XZdURLLBjqBQB335f4SxGwO8ozHeX8SBJnZGbi9PsL8T2GnJmkmy6iam'
  //   },

  //   body: JSON.stringify({
  //     image_id: id
  //   })
  // });
  
  /** Con axios */
  const {data, status} = await api.post('/favourites',{
    image_id: id,
  })
  if (status !== 200) {
    spanError.innerHTML = 'Hubo un error ' + status + ' ' + data;
  } else {
    getFavoritesCats();
  }
};

const deleteFavoriteMichi = async (id) => {
  const response = await fetch(URL_Delete_Favorites(id), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':
        'live_ql7ZHIc6XZdURLLBjqBQB335f4SxGwO8ozHeX8SBJnZGbi9PsL8T2GnJmkmy6iam'
    }
  });
  if (response.status !== 200) {
    spanError.innerHTML = 'Hubo un error ' + response.status;
  } else {
    const data = await response.json();
    getFavoritesCats();
  }
};

const uploadMichi = async ()=>{
  try {
    
    const form = document.getElementById('uploadingform')
    const formData = new FormData(form);

    const res = await fetch(URL_UPLOAD, { 
      method: 'POST',
      headers: {
        // 'Content-Type':'multipart/form-data',
        'X-API-KEY':
        'live_ql7ZHIc6XZdURLLBjqBQB335f4SxGwO8ozHeX8SBJnZGbi9PsL8T2GnJmkmy6iam'
      },
      body:formData
    })
    const data = await res.json();
    console.log(data);
    
    if (res.status !== 201) {
      spanError.innerText = 'Hubo un error: ' + res.status;
      console.log(data);
    } else {
      console.log('Foto de michi subida');
      console.log({data});
      console.log(data.url);
      saveFavoritesCats(data.id);
      form.reset();
    }
  } catch (error) {
    // const data = await res.json();
    console.log(error);
  }

}

getRandomCats();
getFavoritesCats();
const btn = document.getElementById('btnGato');
btn.addEventListener('click', getRandomCats);
const btnForm = document.getElementById('btnForm')
btnForm.addEventListener('click',uploadMichi)
