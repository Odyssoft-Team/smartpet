# 🐾 Pet Care Service Database Schema

Este documento describe la estructura de la base de datos para la aplicación de servicios de cuidado de mascotas.

---

## 💾 Tablas de la Base de Datos

### 🧑 Perfiles y Mascotas

#### `public.profiles`
Contiene la información del perfil del usuario.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK, FK (auth.users)** | ID del usuario. |
| `full_name` | `text` | | Nombre completo del usuario. |
| `avatar_url` | `text` | | URL de la imagen de perfil. |
| `phone` | `text` | | Número de teléfono. |
| `address` | `text` | | Dirección completa. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `email` | `text` | `UNIQUE`, `CHECK (length <= 50)` | Correo electrónico. |
| `label_address` | `text` | `CHECK (length <= 50)` | Etiqueta corta para la dirección. |

#### `public.pets`
Almacena la información de las mascotas registradas por los usuarios.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID único de la mascota. |
| `user_id` | `uuid` | **FK (profiles)** | Propietario de la mascota. |
| `name` | `text` | `NOT NULL` | Nombre de la mascota. |
| `weight` | `numeric` | | Peso en alguna unidad estándar. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `birth_date` | `date` | | Fecha de nacimiento. |
| `updated_at` | `timestamp with time zone` | | Última actualización. |
| `photo_url` | `text` | | URL de la foto de la mascota. |
| `social_behavior` | `smallint` | `CHECK (1-5)` | Nivel de comportamiento social (1: Bajo, 5: Alto). |
| `allergies` | `text` | `CHECK (length <= 100)` | Lista de alergias. |
| `special_condition` | `text` | `CHECK (length <= 20)` | Condición médica especial. |
| `species_id` | `bigint` | **FK (species_catalog)** | Especie de la mascota. |
| `breed_id` | `bigint` | **FK (breed_catalog)** | Raza de la mascota. |

#### `public.species_catalog`
Catálogo de especies de mascotas.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK** | ID de la especie. |
| `name` | `text` | `NOT NULL`, `UNIQUE` | Nombre de la especie (e.g., 'Perro', 'Gato'). |

#### `public.breed_catalog`
Catálogo de razas de mascotas, relacionado con la especie.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK** | ID de la raza. |
| `species_id` | `bigint` | `NOT NULL`, **FK (species_catalog)** | Especie a la que pertenece la raza. |
| `name` | `text` | `NOT NULL` | Nombre de la raza. |

### 🛒 Servicios y Órdenes

#### `public.services`
Catálogo de servicios ofrecidos.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID del servicio. |
| `name` | `text` | `NOT NULL` | Nombre del servicio. |
| `description` | `text` | | Descripción detallada. |
| `price` | `numeric` | | Precio base del servicio. |
| `duration_minutes` | `integer` | | Duración estimada en minutos. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `is_active` | `boolean` | `DEFAULT true` | Indica si el servicio está activo. |

#### `public.service_variants`
Variantes de un servicio base (e.g., tamaño, duración).

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID de la variante. |
| `service_id` | `bigint` | `NOT NULL`, **FK (services)** | Servicio base. |
| `name` | `text` | `NOT NULL` | Nombre de la variante. |
| `description` | `text` | | Descripción de la variante. |
| `price_delta` | `numeric` | `DEFAULT 0` | Diferencia de precio respecto al precio base. |
| `is_active` | `boolean` | `DEFAULT true` | Indica si la variante está activa. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |

#### `public.service_options`
Opciones adicionales que se pueden agregar a un servicio (add-ons).

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID de la opción. |
| `service_id` | `bigint` | `NOT NULL`, **FK (services)** | Servicio al que pertenece la opción. |
| `name` | `text` | `NOT NULL` | Nombre de la opción. |
| `price` | `numeric` | `DEFAULT 0` | Costo adicional de la opción. |
| `is_active` | `boolean` | `DEFAULT true` | Indica si la opción está activa. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `description` | `text` | `CHECK (length <= 50)` | Descripción de la opción. |

#### `public.cards`
Almacena la información de las tarjetas de pago.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK** | ID de la tarjeta. |
| `user_id` | `uuid` | `NOT NULL`, **FK (profiles)** | Propietario de la tarjeta. |
| `label` | `text` | | Etiqueta para identificar la tarjeta. |
| `card_holder_name` | `text` | `NOT NULL` | Nombre del titular. |
| `card_number` | `text` | `NOT NULL` | Número de tarjeta (parcial/token). |
| `expiry_month` | `integer` | `NOT NULL`, `CHECK (1-12)` | Mes de caducidad. |
| `expiry_year` | `integer` | `NOT NULL`, `CHECK (2024-2050)` | Año de caducidad. |
| `brand` | `text` | `NOT NULL`, `CHECK` | Marca de la tarjeta. |
| `is_default` | `boolean` | `DEFAULT false` | Indica si es la tarjeta predeterminada. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `updated_at` | `timestamp with time zone` | `DEFAULT now()` | Última actualización. |

#### `public.service_orders`
Registro de los pedidos de servicios.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK** | ID de la orden de servicio. |
| `user_id` | `uuid` | `NOT NULL`, **FK (profiles)** | Usuario que realiza la orden. |
| `pet_id` | `bigint` | `NOT NULL`, **FK (pets)** | Mascota para la que se pide el servicio. |
| `variant_id` | `bigint` | **FK (service_variants)** | Variante del servicio seleccionado. |
| `card_id` | `uuid` | **FK (cards)** | Tarjeta utilizada para el pago. |
| `scheduled_date` | `date` | | Fecha programada del servicio. |
| `scheduled_time` | `time without time zone` | | Hora programada del servicio. |
| `total` | `numeric` | `DEFAULT 0` | Costo total de la orden. |
| `payment_status` | `text` | `DEFAULT 'unpaid'`, `CHECK` | Estado del pago (`unpaid`, `paid`, `refunded`). |
| `status` | `text` | `DEFAULT 'pending'`, `CHECK` | Estado de la orden (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled`). |
| `notes` | `text` | | Notas adicionales para el servicio. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `updated_at` | `timestamp with time zone` | `DEFAULT now()` | Última actualización. |

#### `public.order_options`
Relación N:M entre órdenes de servicio y opciones adicionales.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID del registro. |
| `order_id` | `uuid` | `NOT NULL`, **FK (service_orders)** | Orden de servicio. |
| `option_id` | `bigint` | `NOT NULL`, **FK (service_options)** | Opción de servicio seleccionada. |
| `price` | `numeric` | `DEFAULT 0` | Precio de la opción en el momento de la orden. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |

#### `public.order_status_logs`
Historial de cambios de estado de una orden.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID del log. |
| `order_id` | `uuid` | `NOT NULL`, **FK (service_orders)** | Orden a la que se refiere. |
| `status` | `text` | `NOT NULL`, `CHECK` | Nuevo estado (`requested`, `confirmed`, `en_route`, `in_progress`, `completed`, `cancelled`). |
| `message` | `text` | | Mensaje/nota sobre el cambio de estado. |
| `location` | `jsonb` | | Ubicación asociada al cambio de estado. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo del cambio. |

#### `public.pet_services`
Registra los servicios individuales realizados a una mascota.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK, IDENTITY** | ID del servicio realizado. |
| `pet_id` | `bigint` | **FK (pets)** | Mascota que recibió el servicio. |
| `service_id` | `bigint` | **FK (services)** | Tipo de servicio realizado. |
| `performed_at` | `timestamp with time zone` | `DEFAULT now()` | Fecha y hora en que se realizó. |
| `notes` | `text` | | Notas del servicio (e.g., resultados). |
| `status` | `text` | `DEFAULT 'pending'`, `CHECK` | Estado (`pending`, `completed`, `cancelled`). |
| `order_id` | `uuid` | **FK (service_orders)** | Orden de servicio asociada (si aplica). |

### 💉 Historial Médico y Clínicas

#### `public.clinics`
Información sobre clínicas veterinarias.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK** | ID de la clínica. |
| `name` | `text` | `NOT NULL` | Nombre de la clínica. |
| `address` | `text` | | Dirección de la clínica. |
| `phone` | `text` | | Teléfono de contacto. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |

#### `public.revision_type_catalog`
Catálogo de tipos de revisión.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK** | ID del tipo de revisión. |
| `name` | `text` | `NOT NULL`, `UNIQUE` | Nombre del tipo de revisión (e.g., 'Consulta general', 'Emergencia'). |

#### `public.revision_status_catalog`
Catálogo de estados de revisión.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK** | ID del estado de revisión. |
| `name` | `text` | `NOT NULL`, `UNIQUE` | Nombre del estado de revisión (e.g., 'Programada', 'Finalizada'). |

#### `public.revisions`
Registro de revisiones médicas o consultas.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK** | ID de la revisión. |
| `pet_id` | `bigint` | `NOT NULL`, **FK (pets)** | Mascota examinada. |
| `clinic_id` | `uuid` | **FK (clinics)** | Clínica donde se realizó. |
| `description` | `text` | | Notas del veterinario/diagnóstico. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Fecha de la revisión. |
| `revision_type_id` | `bigint` | **FK (revision_type_catalog)** | Tipo de revisión. |
| `revision_status_id` | `bigint` | **FK (revision_status_catalog)** | Estado actual de la revisión. |

#### `public.vaccine_catalog`
Catálogo de nombres de vacunas.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK** | ID de la vacuna. |
| `name` | `text` | `NOT NULL`, `UNIQUE` | Nombre de la vacuna. |

#### `public.vaccines`
Registro de vacunas aplicadas a las mascotas.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK** | ID del registro de vacuna. |
| `pet_id` | `bigint` | `NOT NULL`, **FK (pets)** | Mascota vacunada. |
| `applied_at` | `date` | `NOT NULL` | Fecha de aplicación. |
| `next_dose_at` | `date` | | Fecha de la próxima dosis. |
| `notes` | `text` | | Notas sobre la aplicación. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `vaccine_catalog_id` | `bigint` | **FK (vaccine_catalog)** | Vacuna aplicada. |

#### `public.deworming_product_catalog`
Catálogo de productos desparasitantes.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | **PK** | ID del producto. |
| `name` | `text` | `NOT NULL`, `UNIQUE` | Nombre del producto desparasitante. |

#### `public.deworming`
Registro de tratamientos de desparasitación.

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK** | ID del registro de desparasitación. |
| `pet_id` | `bigint` | `NOT NULL`, **FK (pets)** | Mascota desparasitada. |
| `applied_at` | `date` | `NOT NULL` | Fecha de aplicación. |
| `next_dose_at` | `date` | | Fecha de la próxima dosis. |
| `notes` | `text` | | Notas sobre la aplicación. |
| `created_at` | `timestamp with time zone` | `DEFAULT now()` | Marca de tiempo de creación. |
| `product_catalog_id` | `bigint` | **FK (deworming_product_catalog)** | Producto utilizado. |