-- Datos del steakhouse premium "La Estancia" (parrilla).
-- Ejecutar después de schema.sql (los upsert actualizan los datos existentes).

insert into public.categories (id, name, emoji, sort_order) values
  ('entradas', 'Entradas', '🧀', 1),
  ('cortes', 'Cortes', '🥩', 2),
  ('guarniciones', 'Guarniciones', '🥔', 3),
  ('dulces', 'Dulces', '🍰', 4),
  ('bebidas', 'Bebidas', '🍷', 5)
on conflict (id) do update set name = excluded.name, emoji = excluded.emoji, sort_order = excluded.sort_order;

insert into public.dishes (id, name, description, price, emoji, category_id, popular) values
  ('provoleta', 'Provoleta a la parrilla', 'Provoleta fundida con orégano, aceite de oliva y pan de campo.', 8.90, '🧀', 'entradas', true),
  ('chorizo', 'Chorizo criollo', 'Chorizo a la brasa con chimichurri de la casa.', 7.90, '🌭', 'entradas', false),
  ('bife', 'Bife de chorizo', 'Corte premium 300g con maduración de 21 días, a la parrilla.', 18.90, '🥩', 'cortes', true),
  ('ojo', 'Ojo de bife', 'Ancho de vaca 400g al término perfecto, con chimichurri.', 24.90, '🥩', 'cortes', true),
  ('asado', 'Asado de tira', 'Asado de tira de res, 12 horas de cocción lenta al carbón.', 16.90, '🍖', 'cortes', false),
  ('lomo', 'Lomo al carbón', 'Medallones de lomo fino con reducción de vino tinto.', 19.90, '🥓', 'cortes', false),
  ('papas', 'Papas rústicas', 'Papas doradas con romero fresco y sal de mar.', 5.50, '🍟', 'guarniciones', false),
  ('ensalada', 'Ensalada césar', 'Lechuga, pollo a la plancha, parmesano y crutones.', 7.90, '🥗', 'guarniciones', false),
  ('torta', 'Torta de chocolate', 'Porción de torta húmeda de chocolate con crema belga.', 5.90, '🍰', 'dulces', true),
  ('cheesecake', 'Cheesecake de maracuyá', 'Suave cheesecake con coulis de maracuyá.', 6.90, '🎂', 'dulces', false),
  ('limonada', 'Limonada frozen', 'Limonada natural con hielo y hierbabuena.', 3.50, '🍋', 'bebidas', false),
  ('vino', 'Copa de vino tinto', 'Malbec argentino seleccionado por nuestro sommelier.', 7.90, '🍷', 'bebidas', true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  emoji = excluded.emoji,
  category_id = excluded.category_id,
  popular = excluded.popular;

insert into public.mesas (numero) values (1), (2), (3), (4), (5), (6)
on conflict (numero) do nothing;

insert into public.resenas (id, autor, rating, texto) values
  ('r-demo-1', 'Lucía Fernández', 5, 'El ojo de bife es de otro nivel. Maduración perfecta y la atención impecable.'),
  ('r-demo-2', 'Jorge Ramírez', 5, 'Pedí desde la mesa con el código QR y llegó rapidísimo.'),
  ('r-demo-3', 'Sofía Castillo', 4, 'Ambiente premium y el bife de chorizo es de los mejores que he probado.')
on conflict (id) do update set autor = excluded.autor, rating = excluded.rating, texto = excluded.texto;
