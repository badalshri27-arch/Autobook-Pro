async function login(){

  const email =
  document.getElementById(
    'email'
  ).value

  const password =
  document.getElementById(
    'password'
  ).value

  const role =
  document.getElementById(
    'role'
  ).value

  const response =
  await fetch(
    'http://localhost:5000/api/admin/login',
    {
      method:'POST',

      headers:{
        'Content-Type':'application/json'
      },

      body:JSON.stringify({
        email,
        password
      })
    }
  )

  const data =
  await response.json()

  if(data.token){

    localStorage.setItem(
      'token',
      data.token
    )

    localStorage.setItem(
      'role',
      data.admin.role
    )

    if(role === 'super_admin'){

      window.location.href =
      'admin/index.html'
    }

    if(role === 'super_seller'){

      window.location.href =
      'superseller/index.html'
    }

    if(role === 'seller'){

      window.location.href =
      'seller/index.html'
    }
  }

  else{

    alert('Login Failed')
  }
}