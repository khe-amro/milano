-- Milano Bellaka Database Seed Script
-- Generated dynamically from milano_bellaka_menu.xlsx

-- 1. Insert Restaurant
INSERT INTO restaurants (id, owner_id, name, slug, logo_url)
VALUES ('d1c9a617-640a-4a67-b50a-3c58ccad1b2c', NULL, 'Milano Bellaka', 'milano-bellaka', '/images/logo.png')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  logo_url = EXCLUDED.logo_url;

-- 2. Insert Categories
INSERT INTO categories (id, restaurant_id, name_fr, name_ar, order_index)
VALUES ('e887cc3c-9a40-4279-b7b5-24b5d275727a', 'd1c9a617-640a-4a67-b50a-3c58ccad1b2c', 'Pizza', 'البيتزا', 1)
ON CONFLICT (id) DO UPDATE SET 
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  order_index = EXCLUDED.order_index;
INSERT INTO categories (id, restaurant_id, name_fr, name_ar, order_index)
VALUES ('e887cc3c-9a40-4279-b7b5-24b5d275727b', 'd1c9a617-640a-4a67-b50a-3c58ccad1b2c', 'Sandwich', 'السندويشات', 2)
ON CONFLICT (id) DO UPDATE SET 
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  order_index = EXCLUDED.order_index;
INSERT INTO categories (id, restaurant_id, name_fr, name_ar, order_index)
VALUES ('e887cc3c-9a40-4279-b7b5-24b5d275727c', 'd1c9a617-640a-4a67-b50a-3c58ccad1b2c', 'Tacos', 'التاكوس', 3)
ON CONFLICT (id) DO UPDATE SET 
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  order_index = EXCLUDED.order_index;
INSERT INTO categories (id, restaurant_id, name_fr, name_ar, order_index)
VALUES ('e887cc3c-9a40-4279-b7b5-24b5d275727d', 'd1c9a617-640a-4a67-b50a-3c58ccad1b2c', 'Plats', 'الأطباق', 4)
ON CONFLICT (id) DO UPDATE SET 
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  order_index = EXCLUDED.order_index;
INSERT INTO categories (id, restaurant_id, name_fr, name_ar, order_index)
VALUES ('e887cc3c-9a40-4279-b7b5-24b5d275727e', 'd1c9a617-640a-4a67-b50a-3c58ccad1b2c', 'Boissons', 'المشروبات', 5)
ON CONFLICT (id) DO UPDATE SET 
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  order_index = EXCLUDED.order_index;

-- 3. Insert Menu Items
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('a0aaf1ed-817e-5e39-a0d9-24b2c5447d49', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Margherita', 'بيتزا مارغريتا', 'Sauce tomate, fromage mozzarella', 350, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('2b30ee33-e04d-5af7-a3cf-dcc724fa4607', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Vegtarienne', 'بيتزا بالخضروات', 'Sauce tomate, légumes frais, fromage', 400, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('9c2124ec-2308-5140-8305-e7e1c62f01aa', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Champignons', 'بيتزا بالفطر', 'Sauce tomate, champignons, fromage', 400, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('596ea2e7-d0e0-5093-a511-ac5c17b021c6', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Poulet', 'بيتزا بالدجاج', 'Sauce tomate, poulet, fromage', 450, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('ab2db178-1010-5a45-a573-6e52dc592f3c', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Thon', 'بيتزا بالتونة', 'Sauce tomate, thon, olives, fromage', 450, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('0fc6bfef-6c4e-5204-a580-00fc0153a3b2', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza ViandeHache', 'بيتزا بالفيونداشي', 'Sauce tomate, viande hachée, fromage', 500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('3c5cb308-0ea0-5f01-8a98-7fda3e1b4c69', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Sauce Tomate 3 Fromages', 'بيتزا صلصة طماطم 3 أجبان', 'Sauce tomate, mélange 3 fromages', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('28cc2a53-8714-541f-89ae-91c5f627fb08', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Maison', 'بيتزا ميزون', 'Recette maison spéciale Milano', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('53520e0c-f8b2-51b3-a502-1036d86b9dcb', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Royal', 'بيتزا رويال', 'Garniture royale, viandes et fromages', 650, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('44b1d65a-835d-536c-8e95-aa63e9a9e089', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Creme Fresh Champ. Poulet', 'بيتزا كريم فراش فطر دجاج', 'Crème fraîche, champignons, poulet', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f279376e-9b4f-5654-994f-446d24e3c316', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Sauce Boisee 3 Fromages', 'بيتزا صلصة بوازي 3 أجبان', 'Sauce forestière, mélange 3 fromages', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('345978dc-f17f-5053-8bfc-637149e1f393', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Fumée', 'بيتزا فومي', 'Viande fumée, fromage, sauce spéciale', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('a0fbf7b8-00ca-5c59-a517-5583bf4d0687', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Couverte', 'بيتزا مغطاة', 'Pizza fermée, garniture surprise', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('2e91a23d-c29f-5cf0-ad98-2dc0a7fcef30', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza 4 Saisons', 'بيتزا الفصول الأربعة', 'Quatre sections aux garnitures variées', 800, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('08b162d3-224b-5c92-9e6b-c92560c63f4f', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Bordure Fromage', 'بيتزا حدود بالجبنة', 'Bordure farcie au fromage fondu', 1000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('22f8e0cc-34fd-5569-8794-9c73578b58f2', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza Milano', 'بيتزا ميلانو', 'Signature Milano, garniture premium', 1000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('e49172b4-4220-5e85-80e9-be7887f15e97', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza MEGA XL', 'بيتزا ميغا إكس آل', 'Grande taille XL, garniture au choix', 1700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('ad517140-ab93-5ffc-8487-4d8acc95225d', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza MEGA XXL', 'بيتزا ميغا دوبل إكس آل', 'Très grande taille XXL', 2000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('fa5e2215-176e-5156-884d-9e2715f39a14', 'e887cc3c-9a40-4279-b7b5-24b5d275727a', 'Pizza MEGA Bordure XXL', 'بيتزا ميغا دوبل إكس آل بوردير', 'XXL avec bordure farcie au fromage', 2500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('1218a1e6-e6b4-5fd1-afcf-81296efb4e22', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Complet ViandeHache', 'كومبلي فيونداشي', 'Pain complet, viande hachée, crudités', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('b4e40b70-8d6a-5018-be28-dbd22de3b5ff', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Complet Thon', 'كومبلي تونة', 'Pain complet, thon, crudités', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('5c40285c-2766-5eab-ab45-76be37567805', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Burger', 'برغر', 'Steak haché, salade, tomate, fromage', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('77967d0b-844b-5c47-8a43-55d452d5ae51', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich ShishKebab', 'ساندوتش شيش كباب', 'Brochette de viande grillée, sauce', 350, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('580718c1-02a2-527c-8696-dd307bd57c36', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich Mergaz', 'ساندوتش مرقاز', 'Merguez grillée, pain, crudités', 400, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('7b143e63-a535-58d9-bd92-c7930939cabf', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich ViandeHache Royal', 'ساندوتش رويال فيونداشي', 'Viande hachée premium, sauce royale', 400, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('481483b4-1c77-5e9c-9b62-af2ed647eb66', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich Escalope', 'ساندوتش اسكالوب', 'Escalope panée, pain, sauce', 400, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('8ef19c65-98bb-5a9d-a18d-9e1143f608c7', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Burger Royal', 'برغر رويال', 'Double steak, fromage fondu, sauce royale', 400, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f3b7c1a3-cc2e-50fd-a76a-04ff66364ecd', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich Chawarma Poulet', 'ساندوتش شاورما دجاج', 'Chawarma poulet, légumes, sauce maison', 500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('6fe8cf24-e199-542d-99a8-5d32e323c415', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich Chawarma Viande', 'ساندوتش شاورما لحم', 'Chawarma viande, légumes, sauce maison', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('54d05753-458c-57f1-930b-37dedff7147c', 'e887cc3c-9a40-4279-b7b5-24b5d275727b', 'Sandwich Foie', 'ساندوتش كبدة', 'Foie grillé, pain, crudités', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('9ead8977-3904-5faf-a005-9f63303ffc7a', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos ViandeHache', 'طاكوس فيونداشي', 'Tacos viande hachée, sauce fromagère', 500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('1c14b856-cc18-5884-87c2-e61c29f62e8c', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Escalope', 'طاكوس اسكالوب', 'Tacos escalope panée, sauce', 500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f55da371-65e7-551c-aeee-8ebf50f5c727', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Gratine Escalope', 'طاكوس غراتين اسكالوب', 'Tacos escalope gratiné au fromage', 550, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('073a63dd-d64a-5c5f-a7ed-ab014dff1165', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Gratine Viande', 'طاكوس غراتين لحم', 'Tacos viande gratiné au fromage', 550, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('a54aafee-1ccd-527b-ab23-6771c6036173', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Mergaz', 'طاكوس مرغاز', 'Tacos merguez, sauce piquante', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('08b0e6ab-b5da-5678-95b0-96108fde3acc', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Foie', 'طاكوس كبدة', 'Tacos foie grillé, sauce maison', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f12cfde3-a870-5042-866d-c6b43a7cda6f', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Mixte', 'طاكوس ميكس', 'Tacos garniture mixte, sauce fromagère', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('87f78343-6f0f-5338-8bbf-45d92ee58db9', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Gratine Fois', 'طاكوس غراتين كبدة', 'Tacos foie gratiné au fromage', 650, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('31d614e1-5984-5249-a025-2a1cdd9e1ad8', 'e887cc3c-9a40-4279-b7b5-24b5d275727c', 'Tacos Gratine Mixte', 'طاكوس غراتين ميكس', 'Tacos mixte gratiné au fromage', 650, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('4681a2bf-fc4d-52cb-9ec9-2c238fd8661d', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Friet', 'طبق فريت', 'Portion de frites maison', 150, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('9021da4a-0266-5d64-8f36-b6185c154c24', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Salade Verte', 'طبق سلطة خضراء', 'Salade verte fraîche', 200, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('486648c7-807e-50de-984a-c071dbeea446', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Salade Algerienne', 'طبق سلطة جزائرية', 'Salade algérienne tomate-concombre', 200, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('76d6acc7-b228-5bca-b9df-3083b285ae91', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Puree', 'طبق بيري', 'Purée de pommes de terre maison', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('51544b92-2cf0-5d24-8518-9ce936808d3a', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Macaroni', 'طبق معكرونا', 'Macaroni sauce tomate', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('a4d65b64-72a5-54b6-ae31-57dff4cf2ede', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat ROZ', 'طبق أرز', 'Riz blanc ou pilaf', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('5d1d78d8-0e04-508b-afe0-ffb9da4970e7', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Escalope', 'طبق اسكالوب', 'Escalope panée, frites, salade', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f0f9880a-0aa6-52fc-82ab-028cdae670ff', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat ViandeHache', 'طبق فيونداشي', 'Viande hachée grillée, frites, salade', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('01015f38-b6e2-595d-b39b-8e82260559b7', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat ShishKabab', 'طبق شيش كباب', 'Brochettes grillées, pain, crudités', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f5423413-03ce-5db0-90d0-cd4e411d8b1e', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Thon', 'طبق تونة', 'Thon grillé, frites, salade', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('8c68311e-a98c-57d9-9e28-39b054965f66', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Grattan Poulet', 'طبق غراتان دجاج', 'Poulet gratiné au fromage, frites', 600, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('1f4cfe21-80c6-5f1b-aa0d-622664c54f33', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Fajita', 'طبق فاهيتا', 'Fajita poulet ou viande, légumes sautés', 650, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('9d7397d9-cfd4-5251-afd8-f98523a2b386', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Mexicano', 'طبق ميكسيكانو', 'Plat mexicain épicé, riz, haricots', 650, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('7524fd15-ef27-53e5-b9ed-d5f226a262f6', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Franchisco', 'طبق فرانسيسكو', 'Spécialité maison Franchisco', 650, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('3960b61a-50e1-509c-970b-41434e63a7b7', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Poulet', 'طبق دجاج', 'Poulet grillé, frites, salade', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('34183300-50d6-5dc1-9e8c-d99371e92107', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Chawarma Poulet', 'طبق شاورما دجاج', 'Chawarma poulet, riz, sauce maison', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('0ae22b4d-2607-5d31-b25c-bd914b186429', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Regime', 'طبق ريجيم', 'Plat léger, légumes, protéines', 700, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('5d329ac7-dd63-52b2-a039-7f07f8ed8710', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Cordon Blue', 'طبق كوردون بلو', 'Poulet farci au jambon et fromage', 800, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('de3a218c-ea31-5521-9540-72dbe5bc74b2', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Chawarma Viande', 'طبق شاورما باللحم', 'Chawarma viande, riz, sauce maison', 1000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('e28912f5-bd72-5a4d-a3fe-7e063eb73eff', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Mixte', 'طبق ميكس', 'Assortiment de viandes grillées', 1000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('ad660c6d-4e52-53a3-bd7f-20e43334ca22', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat Poisson Dorado', 'طبق سمك الدورادو', 'Poisson Dorado grillé, salade, frites', 1500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('8da5a4d7-1728-5698-ad7e-b029a7783738', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', '1/2 Épaule', '1/2 كتف', 'Demi-épaule d''agneau rôtie', 2500, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('c3b14be2-37fd-5a61-a3aa-0cd1f78d00b7', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Plat De Marriage', 'طبق العرسان', 'Grand plat pour occasions spéciales', 4000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('3c30f11a-0b54-519a-a783-ef62f95ea996', 'e887cc3c-9a40-4279-b7b5-24b5d275727d', 'Épaule', 'كتف', 'Épaule d''agneau entière rôtie', 5000, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f9735a99-2fde-50c4-b013-bc77d347aef6', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Bouteille D''Eau 0.33L', 'قارورة ماء صغيرة', 'Eau minérale 0.33L', 30, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('d37cd552-3bb9-5e5b-b64b-027fd91139e6', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Bouteille D''Eau 1.5L', 'قارورة ماء كبيرة', 'Eau minérale 1.5L', 50, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('f2386cfa-81df-5226-879c-371c87f985b1', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Cafe Noir', 'قهوة سوداء', 'Café espresso', 50, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('11ddf3fd-4816-5042-aa10-e96b9c6e0ec1', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Bouteille De Jus 0.33L', 'قارورة عصير صغيرة', 'Jus en bouteille 0.33L', 70, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('eccbcd8f-ed42-58ea-b391-49284148bd61', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Boissons Canette', 'كانات', 'Boisson en canette (Pepsi, 7Up...)', 100, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('4816a57e-b68f-5f20-b939-d797ab172355', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'CocaCola 1L', 'كوكا كولا 1 ل', 'Coca-Cola bouteille 1L', 120, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('fef90518-b07d-5271-9e05-df9936ef89e3', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Jus 1L', 'عصير 1 ل', 'Jus de fruits bouteille 1L', 150, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('164d6f33-768b-5d27-8e28-2f557a05f316', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Schweppes 1L', 'شوايس 1 ل', 'Schweppes bouteille 1L', 150, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('8f354e38-6e2d-5cf1-bbd2-8d60ddefaa15', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Jus Naturel', 'عصير طبيعي', 'Jus de fruits frais pressé', 150, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('09c61814-9e1c-543c-9d77-28fa8db066a5', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Tiramisu', 'تيراميسو', 'Dessert tiramisu maison', 250, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
INSERT INTO menu_items (id, category_id, name_fr, name_ar, description, price, image_url, is_available)
VALUES ('b86c607e-7b9d-53b9-acf5-786c47a08cf3', 'e887cc3c-9a40-4279-b7b5-24b5d275727e', 'Crepe', 'كراب', 'Crêpe sucrée maison', 300, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  price = EXCLUDED.price;