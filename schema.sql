-- Tabla para Cambio de Divisas
CREATE TABLE cambio_divisas (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  accion VARCHAR(50) NOT NULL,
  cantidad DECIMAL(15, 2) NOT NULL,
  moneda_origen VARCHAR(10) NOT NULL,
  moneda_destino VARCHAR(10) NOT NULL,
  precio_cambio DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  descripcion TEXT
);

-- Tabla para Inversiones
CREATE TABLE inversiones (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  accion VARCHAR(50) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  plataforma VARCHAR(50) NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unidad DECIMAL(15, 2) NOT NULL,
  moneda VARCHAR(10) NOT NULL,
  descripcion TEXT
);

-- Tabla para Transferencias
CREATE TABLE transferencias (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  accion VARCHAR(50) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  billetera_origen VARCHAR(50) NOT NULL,
  billetera_destino VARCHAR(50) NOT NULL,
  monto_inicial DECIMAL(15, 2) NOT NULL,
  monto_final DECIMAL(15, 2) NOT NULL,
  moneda VARCHAR(10) NOT NULL,
  comision DECIMAL(15, 2) NOT NULL,
  descripcion TEXT
);

-- Tabla para Gastos e Ingresos
CREATE TABLE gastos_ingresos (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  accion VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  moneda VARCHAR(10) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT
);

-- Tabla para Billeteras
CREATE TABLE billeteras (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  saldo DECIMAL(15, 2) NOT NULL,
  moneda VARCHAR(10) NOT NULL,
  ultima_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_cambio_divisas_fecha ON cambio_divisas(fecha);
CREATE INDEX idx_inversiones_fecha ON inversiones(fecha);
CREATE INDEX idx_transferencias_fecha ON transferencias(fecha);
CREATE INDEX idx_gastos_ingresos_fecha ON gastos_ingresos(fecha);
CREATE INDEX idx_gastos_ingresos_accion ON gastos_ingresos(accion);
CREATE INDEX idx_inversiones_categoria ON inversiones(categoria);
