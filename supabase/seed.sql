-- Datos de ejemplo para el menú demo (misma data que la app local).
-- Ejecutar después de schema.sql.

insert into public.categories (id, name, emoji, sort_order) values
  ('entradas', 'Entradas', '🥗', 1),
  ('hamburguesas', 'Hamburguesas', '🍔', 2),
  ('pizza', 'Pizza', '🍕', 3),
  ('parrilla', 'Parrilla', '🥩', 4),
  ('dulces', 'Dulces', '🍰', 5),
  ('bebidas', 'Bebidas', '🥤', 6)
on conflict (id) do nothing;

insert into public.dishes (id, name, description, price, emoji, category_id, popular) values
  ('palitos', 'Palitos de queso', 'Crocantes palitos rebozados con salsa especial de la casa.', 6.50, '🧀', 'entradas', true),
  ('nachos', 'Nachos supremos', 'Nachos con queso cheddar fundido, jalapeños y pico de gallo.', 7.90, '🌮', 'entradas', false),
  ('classica', 'Hamburguesa clásica', 'Carne 100% de res, lechuga, tomate y nuestra salsa secreta.', 9.90, '🍔', 'hamburguesas', true),
  ('double', 'Hamburguesa doble', 'Doble carne, doble queso cheddar y tocino crocante.', 13.50, '🍔', 'hamburguesas', false),
  ('margherita', 'Pizza margherita', 'Salsa de tomate italiana, mozzarella fresca y albahaca.', 11.90, '🍕', 'pizza', true),
  ('pepperoni', 'Pizza pepperoni', 'Generosa capa de pepperoni y queso fundido, masa al horno de leña.', 13.90, '🍕', 'pizza', false),
  ('costillas', 'Costillas BBQ', 'Pork ribs glaseadas en BBQ, con papas rústicas.', 16.90, '🍖', 'parrilla', true),
  ('lomo', 'Lomo saltado', 'Lomo de res con verduras salteadas al estilo criollo.', 14.50, '🥩', 'parrilla', false),
  ('torta', 'Torta de chocolate', 'Porción de torta húmeda de chocolate con crema belga.', 5.90, '🍰', 'dulces', true),
  ('cheesecake', 'Cheesecake de maracuyá', 'Suave cheesecake con coulis de maracuyá.', 6.90, '🎂', 'dulces', false),
  ('limonada', 'Limonada frozen', 'Limonada natural con hielo y hierbabuena.', 3.50, '🍋', 'bebidas', false),
  ('maracuya', 'Jugo de maracuyá', 'Jugo fresco de maracuyá con agua mineral.', 3.90, '🥤', 'bebidas', false)
on conflict (id) do nothing;

insert into public.mesas (numero) values (1), (2), (3), (4), (5), (6)
on conflict (numero) do nothing;

insert into public.resenas (id, autor, rating, texto) values
  ('r-demo-1', 'Lucía Fernández', 5, 'Las costillas BBQ son de otro mundo. El servicio fue excelente.'),
  ('r-demo-2', 'Jorge Ramírez', 5, 'Pedí desde la mesa con el código QR y llegó rapidísimo.'),
  ('r-demo-3', 'Sofía Castillo', 4, 'Ambiente acogedor y el lomo saltado es de los mejores que he probado.')
on conflict (id) do nothing;
