
# Vitaconex

## [See the App!](https://vitaconex.netlify.app/)

https://res.cloudinary.com/dagphzq9d/image/upload/v1750346251/vitaconex_mfypkc.svg

## 📝Description

Vitaconex App is a project designed with patients and healthcare professionals in mind.
In this development, I'm trying to find a necessary middle ground between human connection and professional care when someone needs medical, psychological, or health-related support in life.

I believe it's very important to have a fluent and healthy relationship with your healthcare providers. One of the first steps toward this is keeping a journal about your feelings.

On the other hand, this perspective aims to deliver an important message: health is not just physical. Everything that happens in our bodies matters, and these experiences often affect our emotional state.

- 👩‍⚕️ **Healthcare professionals** can view and edit data of assigned patients.
- 🧑‍💼 **Administrators** can manage users and roles via a centralized dashboard.
- 👤 **Patients** can access their profile and relevant medical data, also can access to emotional journal.

#### 🔗 Project Repositories:
- 🖥️ [Client Repository (Frontend)](https://github.com/AmaliaBM/vitaconex)
- 🗄️ [Server Repository (Backend)](https://github.com/AmaliaBM/vitaconex-server)

---

## 🧩 Backlog Functionalities

**Some features I plan to develop in the future include a menstrual calendar for women and tools related to menopause.
The idea is to incorporate a more feminine perspective on health.** 

## 🛠️ Technologies used

**HTML, CSS, Javascript, Express, React, axios, React Context, npm... ** 

```

## 🧠 API Endpoints (backend routes)

| HTTP Method | URL                                      | Request Body                                     | Success Status | Error Status | Description                                                                 |
|-------------|------------------------------------------|--------------------------------------------------|----------------|--------------|-----------------------------------------------------------------------------|
| **Auth**    |                                          |                                                  |                |              |                                                                             |
| POST        | `/auth/signup`                           | `{name, lastname, email, password, role}`        | 201            | 400          | Registra un nuevo usuario                                                   |
| POST        | `/auth/login`                            | `{email, password}`                              | 200            | 400, 401     | Inicia sesión, devuelve token                                               |
| GET         | `/auth/verify`                           | –                                                | 200            | 401          | Verifica el JWT del usuario                                                 |
|             |                                          |                                                  |                |              |                                                                             |
| **Admin**   |                                          |                                                  |                |              |                                                                             |
| GET         | `/admin/users`                           | – (opcional: `?role=sanitario`)                  | 200            | 400, 401     | Devuelve lista de todos los usuarios (filtrables por rol)                  |
| GET         | `/admin/users/:id`                       | –                                                | 200            | 404, 401     | Devuelve los detalles de un usuario                                         |
| PUT         | `/admin/users/:id`                       | `{...actualización de campos}`                   | 200            | 400, 404     | Actualiza los datos de un usuario                                           |
| DELETE      | `/admin/users/:id/secure`                | `{password}`                                     | 200            | 400, 401     | Elimina un usuario si la contraseña del admin es correcta                  |
| POST        | `/admin/users` *(si creas desde panel)*  | `{name, lastname, email, role, ...}`             | 201            | 400          | Crea un nuevo usuario desde el panel de admin                              |
|             |                                          |                                                  |                |              |                                                                             |
| **Sanitario** |                                        |                                                  |                |              |                                                                             |
| GET         | `/sanitario/pacientes`                   | –                                                | 200            | 401          | Devuelve los pacientes asignados al sanitario                              |
| GET         | `/sanitario/pacientes/:id`               | –                                                | 200            | 404, 401     | Detalles del paciente                                                       |
| PUT         | `/sanitario/pacientes/:id`               | `{...campos a editar}`                           | 200            | 400, 401     | Edita los datos del paciente                                                |
|             |                                          |                                                  |                |              |                                                                             |
| **Paciente** |                                         |                                                  |                |              |                                                                             |
| GET         | `/paciente/profile`                      | –                                                | 200            | 401          | Perfil del paciente                                                         |
| PUT         | `/paciente/profile`                      | `{...campos a editar}`                           | 200            | 400, 401     | Edita su propio perfil                                                      |
from API                                     |
  