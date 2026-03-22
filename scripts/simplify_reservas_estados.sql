-- Simplificar estado de reservas: todas son confirmadas por defecto
-- Cambiar el default del campo estado a 'confirmada'

ALTER TABLE reservas 
ALTER COLUMN estado SET DEFAULT 'confirmada';

-- Actualizar cualquier reserva que no sea confirmada a confirmada
-- (En la nueva lógica, solo existen reservas confirmadas)
UPDATE reservas 
SET estado = 'confirmada', updated_at = now() 
WHERE estado IN ('pendiente', 'cancelada');

-- Agregar constraint que garantice que todos los estados sean 'confirmada'
-- Primero remover constraint anterior si existe
ALTER TABLE reservas DROP CONSTRAINT IF EXISTS check_estado_valido;

-- Agregar nuevo constraint
ALTER TABLE reservas 
ADD CONSTRAINT check_estado_confirmada CHECK (estado = 'confirmada');
