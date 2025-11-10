// Archivo eliminado: Este registro ha sido reemplazado por el flujo de pasos
// RegisterPetStep1 → RegisterPetStep2 → RegisterPetStep3 → RegisterPetStep4 → RegisterPetStep5
// 
// Si necesitas recuperar lógica específica, consulta el historial de git
// Funcionalidad migrada:
// - Nombre: RegisterPetStep1.tsx
// - Especie/Raza: RegisterPetStep2.tsx (ahora con dinámicas desde BD)
// - Peso: RegisterPetStep3.tsx
// - Edad: RegisterPetStep4.tsx
// - Foto: RegisterPetStep5.tsx
//
// Cambios importantes:
// - Los IDs de especie (1=Perro, 2=Gato) se obtienen desde Supabase
// - Las razas se cargan dinámicamente según la especie
// - El peso se convierte correctamente a número
// - La fecha de nacimiento se calcula desde edad o desde fecha directa
