import fs from 'fs';

const rawData = `CÓDIGO	DESCRIPCIÓN	COLOR	CATEGORÍA	TALLA	PRECIO FINAL
62156	Bermuda felpa basica	Matcha	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	5.99
62156	Bermuda felpa basica	Matcha	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	5.99
62156	Bermuda felpa basica	Matcha	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	5.99
62157	Bermuda felpa basica	Oceano	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	5.99
62157	Bermuda felpa basica	Oceano	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	5.99
62157	Bermuda felpa basica	Oceano	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	5.99
62157	Bermuda felpa basica	Oceano	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	5.99
62160	Bermuda felpa basica	Atolon	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	5.99
62160	Bermuda felpa basica	Atolon	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92CM)	5.99
62160	Bermuda felpa basica	Atolon	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	5.99
62160	Bermuda felpa basica	Atolon	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	5.99
1009.93	Camiseta m/c lenticular	Peach	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	8.39
1009.93	Camiseta m/c lenticular	Peach	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	8.39
1009.93	Camiseta m/c lenticular	Peach	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	8.39
1009.93	Camiseta m/c lenticular	Peach	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	8.39
1010.10	Camiseta m/c vehiculo	Nata	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	8.39
1010.10	Camiseta m/c vehiculo	Nata	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	8.39
1010.10	Camiseta m/c vehiculo	Nata	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	8.39
1010.10	Camiseta m/c vehiculo	Nata	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	8.39
1011.87	Camiseta m/c aplique	Nata-coche	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	7.74
1011.87	Camiseta m/c aplique	Nata-coche	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	7.74
1011.87	Camiseta m/c aplique	Nata-coche	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	7.74
1089.30	Top canale	Blush	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	8.99
1089.30	Top canale	Blush	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	8.99
1089.30	Top canale	Blush	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	8.99
118.41	Camisa m/l lino c/camisero	Cañamo	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	11.39
1118.41	Camisa m/l lino c/camisero	Cañamo	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	11.39
1118.41	Camisa m/l lino c/camisero	cañamo	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	11.39
1118.41	Camisa m/l lino c/camisero	Cañamo	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	11.39
1202.35	Pantalon corto	Hueso	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	11.39
1202.35	Pantalon corto	Hueso	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	11.39
1202.35	Pantalon corto	Hueso	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	11.39
1211.69	Conj. bermuda rayas	Avellana	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	21.59
1211.69	Conj. bermuda rayas	Avellana	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	21.59
1211.69	Conj. bermuda rayas	Avellana	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	21.59
1211.69	Conj. bermuda rayas	Avellana	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	21.59
1212.73	Conj. bermuda	Lago	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	21.59
1212.73	Conj. bermuda	Lago	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	21.59
1212.73	Conj. bermuda	Lago	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	21.59
1212.73	Conj. bermuda	Lago	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	21.59
1227.97	Conj. bermuda lino aplique	Jade	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	19.19
1227.97	Conj. bermuda lino aplique	Jade	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	19.19
1227.97	Conj. bermuda lino aplique	Jade	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	19.19
1228.68	Conj. bermuda seersucker	Mocca	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	17.39
1228.68	Conj. bermuda seersucker	Mocca	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	17.39
1523.61	Pantalon lino relaxed	Anacardo	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	14.99
1523.61	Pantalon lino relaxed	Anacardo	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	14.99
1523.61	Pantalon lino relaxed	Anacardo	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	14.99
1523.61	Pantalon lino relaxed	Anacardo	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	14.99
1658.67	Peto lino suiting	Jade	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	15.90
1658.67	Peto lino suiting	Jade	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	15.90
1658.67	Peto lino suiting	Jade	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	15.90
1658.67	Peto lino suiting	Jade	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	15.90
1663.23	Conj. peto bambula 3 piezas	Arcilla	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	23.99
1663.23	Conj. peto bambula 3 piezas	Arcilla	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	23.99
1663.23	Conj. peto bambula 3 piezas	Arcilla	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	23.99
1665.31	Conj. punto estructura	Jade	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	14.94
1665.31	Conj. punto estructura	Jade	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	14.94
1748.33	Conj. leggings	Cielo	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	14.94
1748.33	Conj. leggings	Cielo	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	14.94
1748.33	Conj. leggings	Cielo	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	14.94
1915.56	Vestido bordado	Blanco	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	19.14
1915.56	Vestido bordado	Blanco	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	19.14
1915.56	Vestido bordado	Blanco	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	19.14
1919.50	Vestido con bolso	Porcelana	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	16.19
1919.50	Vestido con bolso	Porcelana	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	16.19
1919.50	Vestido con bolso	Porcelana	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	16.19
1921.64	Vestido estampado	Peonia	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	14.94
1921.64	Vestido estampado	Peonia	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	14.94
1921.64	Vestido estampado	Peonia	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	14.94
1924.76	Vestido paneles	Flamingo	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	16.14
1924.76	Vestido paneles	Flamingo	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	16.14
1924.76	Vestido paneles	Flamingo	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	16.14
1924.76	Vestido paneles	Flamingo	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	16.14
3013.11	Camiseta m/c aplique	Crudo	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	10.14
3013.11	Camiseta m/c aplique	Crudo	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	10.14
3013.11	Camiseta m/c aplique	Crudo	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	10.14
3013.11	Camiseta m/c aplique	Crudo	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	10.14
3060.72	Camiseta m/c bordado	Nata	NIÑO 3 A 9 AÑOS	5 AÑOS ( 110 CM)	8.39
3060.72	Camiseta m/c bordado	Nata	NIÑO 3 A 9 AÑOS	6 AÑOS (116 CM)	8.39
3060.72	Camiseta m/c bordado	Nata	NIÑO 3 A 9 AÑOS	7 AÑOS ( 122 CM)	8.39
3060.72	Camiseta m/c bordado	Nata	NIÑO 3 A 9 AÑOS	8 AÑOS (128 CM)	8.39
3202.54	Bermuda lino relaxed	Alga	NIÑO 3 A 9 AÑOS	5 AÑOS ( 110 CM)	14.94
3202.54	Bermuda lino relaxed	Alga	NIÑO 3 A 9 AÑOS	6 AÑOS (116 CM)	14.94
3202.54	Bermuda lino relaxed	Alga	NIÑO 3 A 9 AÑOS	7 AÑOS ( 122 CM)	14.94
3202.54	Bermuda lino relaxed	Alga	NIÑO 3 A 9 AÑOS	8 AÑOS (128 CM)	14.94
3225.59	Conj. short punto fantasia	Mandarina	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	20.70
3225.59	Conj. short punto fantasia	Mandarina	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	20.70
3225.59	Conj. short punto fantasia	Mandarina	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	20.70
3227.68	Conj. short rayas	Lilac	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	15.90
3227.68	Conj. short rayas	Lilac	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	15.90
3227.68	Conj. short rayas	Lilac	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	15.90
3229.72	Conj. pantalon corto estampado	Crudo	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	19.19
3229.72	Conj. pantalon corto estampado	Crudo	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	19.19
3229.72	Conj. pantalon corto estampado	Crudo	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	19.19
3.585.916	Pantalon largo lino bordado	Porcelana	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	17.10
3.585.916	Pantalon largo lino bordado	Porcelana	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	17.10
3.585.916	Pantalon largo lino bordado	Porcelana	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	17.10
3.585.916	Pantalon largo lino bordado	Porcelana	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	17.10
3593.58	Conj. pantalon largo rayas	Crd-menta	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	19.19
3593.58	Conj. pantalon largo rayas	Crd-menta	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	19.19
3593.58	Conj. pantalon largo rayas	Crd-menta	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	19.19
3593.58	Conj. pantalon largo rayas	Crd-menta	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	19.19
3593.58	Conj. pantalon largo rayas	Crd-menta	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	19.19
3593.58	Conj. pantalon largo rayas	Crd-menta	NIÑA 3 A 9 AÑOS	9 AÑOS (134 CM)	19.19
3601.18	Conj. punto	Alga	NIÑO 3 A 9 AÑOS	5 AÑOS ( 110 CM)	17.99
3601.18	Conj. punto	Alga	NIÑO 3 A 9 AÑOS	6 AÑOS (116 CM)	17.99
3601.18	Conj. punto	Alga	NIÑO 3 A 9 AÑOS	7 AÑOS ( 122 CM)	17.99
3601.18	Conj. punto	Alga	NIÑO 3 A 9 AÑOS	8 AÑOS (128 CM)	17.99
3888.39	Mono punto crochet	Garbanzo	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	20.94
3888.39	Mono punto crochet	Garbanzo	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	20.94
3888.39	Mono punto crochet	Garbanzo	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	20.94
3888.39	Mono punto crochet	Garbanzo	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	20.94
3888.39	Mono punto crochet	Garbanzo	NIÑA 3 A 9 AÑOS	9 AÑOS (134 CM)	20.94
3935.67	Vestido crochet	Hueso	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	17.94
3935.67	Vestido crochet	Hueso	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	17.94
3935.67	Vestido crochet	Hueso	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	17.94
3935.67	Vestido crochet	Hueso	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	17.94
3936.36	Vestido rayas	Lilac	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	20.40
3936.36	Vestido rayas	Lilac	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	20.40
3936.36	Vestido rayas	Lilac	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	20.40
3936.36	Vestido rayas	Lilac	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	20.40
3936.36	Vestido rayas	Lilac	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	20.40
3936.36	Vestido rayas	Lilac	NIÑA 3 A 9 AÑOS	9 AÑOS (134 CM)	20.40
1206.46	Conj. short 3 piezas	Lilac	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	16.79
1206.46	Conj. short 3 piezas	Lilac	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	16.79
1206.46	Conj. short 3 piezas	Lilac	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	16.79
1206.46	Conj. short 3 piezas	Lilac	MINI NIÑA 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	16.79
1209.60	Conj. short grafica	Hibisco	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	13.19
1209.60	Conj. short grafica	Hibisco	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	13.19
1209.60	Conj. short grafica	Hibisco	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	13.19
1655.24	Conj. baño 2 piezas	Lilac	BAÑO	3 AÑOS (98 CM)	13.14
1655.24	Conj. baño 2 piezas	Lilac	BAÑO	4 AÑOS (104 CM)	13.14
1657.78	Culetin con pañoleta	Turquesa	BAÑO	18 MESES (86 CM)	11.39
1657.78	Culetin con pañoleta	Turquesa	BAÑO	2 AÑOS (92 CM)	11.39
1657.78	Culetin con pañoleta	Turquesa	BAÑO	3 AÑOS (98 CM)	11.39
1657.78	Culetin con pañoleta	Turquesa	BAÑO	4 AÑOS (104 CM)	11.39
1657.79	Culetin con pañoleta	Rojo	BAÑO	18 MESES (86 CM)	11.39
1657.79	Culetin con pañoleta	Rojo	BAÑO	2 AÑOS (92 CM)	11.39
1657.79	Culetin con pañoleta	Rojo	BAÑO	3 AÑOS (98 CM)	11.39
1661.76	Conj. baño camiseta	Peach	BAÑO	2 AÑOS (92 CM)	11.39
1661.76	Conj. baño camiseta	Peach	BAÑO	4 AÑOS (104 CM)	11.39
1661.78	Conj. baño camiseta	Atolon	BAÑO	18 MESES (86 CM)	11.39
1661.78	Conj. baño camiseta	Atolon	BAÑO	2 AÑOS (92 CM)	11.39
1666.35	Conj. punto estructura	Capri	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	16.79
1666.35	Conj. punto estructura	Capri	MINI NIÑO 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	16.79
1666.35	Conj. punto estructura	Capri	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	16.79
1667.81	Conj. punto print con bucket	Matcha	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	16.19
1668.23	Conj. punto play	Arcilla	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	14.99
1668.23	Conj. punto play	Arcilla	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	14.99
1670.44	Conj. punto "friends"	Peach	MINI NIÑO 18 MESES A 4 AÑOS	18 MESES (86 CM)	13.19
1670.44	Conj. punto "friends"	Peach	MINI NIÑO 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	13.19
1670.44	Conj. punto "friends"	Peach	MINI NIÑO 18 MESES A 4 AÑOS	4 AÑOS (104 CM)	13.19
1925.55	Vestido punto granito	Rojo	MINI NIÑA 18 MESES A 4 AÑOS	18 MESES (86 CM)	11.99
1925.55	Vestido punto granito	Rojo	MINI NIÑA 18 MESES A 4 AÑOS	2 AÑOS (92 CM)	11.99
1925.55	Vestido punto granito	Rojo	MINI NIÑA 18 MESES A 4 AÑOS	3 AÑOS (98 CM)	11.99
1926.56	Vestido combinado guipur	Mimosa	NIÑA 3 A 9 AÑOS	2 AÑOS (92 CM)	17.39
1926.56	Vestido combinado guipur	Mimosa	NIÑA 3 A 9 AÑOS	3 AÑOS (98 CM)	17.39
1926.56	Vestido combinado guipur	Mimosa	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	17.39
3232.80	Conj. short piculinas	Pacifico	NIÑA 3 A 9 AÑOS	3 AÑOS (98 CM)	16.14
3232.80	Conj. short piculinas	Pacifico	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	16.14
3232.80	Conj. short piculinas	Pacifico	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	16.14
3233.80	Conj. short piculinas	Pacifico	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	16.14
3232.80	Conj. short piculinas	Pacifico	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	16.14
3602.23	Conj. punto "good vibes"	Peach	NIÑO 3 A 9 AÑOS	5 AÑOS ( 110 CM)	14.99
3602.23	Conj. punto "good vibes"	Peach	NIÑO 3 A 9 AÑOS	6 AÑOS (116 CM)	14.99
3602.23	Conj. punto "good vibes"	Peach	NIÑO 3 A 9 AÑOS	7 AÑOS ( 122 CM)	14.99
3602.23	Conj. punto "good vibes"	Peach	NIÑO 3 A 9 AÑOS	8 AÑOS (128 CM)	14.99
3734.44	Bikini estructura estampado	Pacifico	BAÑO	3 AÑOS (98 CM)	13.14
3734.44	Bikini estructura estampado	Pacifico	BAÑO	5 AÑOS ( 110 CM)	13.14
3734.44	Bikini estructura estampado	Pacifico	BAÑO	6 AÑOS (116 CM)	13.14
3734.44	Bikini estructura estampado	Pacifico	BAÑO	7 AÑOS ( 122 CM)	13.14
3734.44	Bikini estructura estampado	Pacifico	BAÑO	8 AÑOS (128 CM)	13.14
3735.49	Bikini estampado	Oceano	BAÑO	4 AÑOS (104 CM)	13.14
3735.49	Bikini estampado	Oceano	BAÑO	5 AÑOS ( 110 CM)	13.14
3735.49	Bikini estampado	Oceano	BAÑO	6 AÑOS (116 CM)	13.14
3735.49	Bikini estampado	Oceano	BAÑO	7 AÑOS ( 122 CM)	13.14
3735.49	Bikini estampado	Oceano	BAÑO	8 AÑOS (128 CM)	13.14
3889.58	Mono punto cut out	Oasis	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	14.99
3889.58	Mono punto cut out	Oasis	NIÑA 3 A 9 AÑOS	7 AÑOS ( 122 CM)	14.99
3889.58	Mono punto cut out	Oasis	NIÑA 3 A 9 AÑOS	8 AÑOS (128 CM)	14.99
3889.58	Mono punto cut out	Oasis	NIÑA 3 A 9 AÑOS	9 AÑOS (134 CM)	14.99
3942.53	Vestido estampado banda	Oceano	NIÑA 3 A 9 AÑOS	3 AÑOS (98 CM)	17.39
3942.53	Vestido estampado banda	Oceano	NIÑA 3 A 9 AÑOS	4 AÑOS (104 CM)	17.39
3942.53	Vestido estampado banda	Oceano	NIÑA 3 A 9 AÑOS	5 AÑOS ( 110 CM)	17.39
3942.53	Vestido estampado banda	Oceano	NIÑA 3 A 9 AÑOS	6 AÑOS (116 CM)	17.39
10164.95	Toalla	Hipopotamo	BAÑO	2 AÑOS (92 CM)	13.19
10164.95	Toalla	Hipopotamo	BAÑO	2 AÑOS (92CM)	13.19
10164.96	Toalla	Cocodrilo	BAÑO	2 AÑOS (92CM)	13.19
10164.96	Toalla	Cocodrilo	BAÑO	2 AÑOS (92 CM)	13.19
10164.96	Toalla	Cocodrilo	BAÑO	2 AÑOS (92 CM)	13.19
10164.97	Toalla	Pez	BAÑO	2 AÑOS (92 CM)	13.19
10164.97	Toalla	Pez	BAÑO	2 AÑOS (92 CM)	13.19
10164.97	Toalla	Pez	BAÑO	2 AÑOS (92 CM)	13.19
10165.68	Toalla	Lilac	BAÑO	2 AÑOS (92 CM)	13.19
10165.68	Toalla	Lilac	BAÑO	2 AÑOS (92 CM)	13.19
10165.68	Toalla	Lilac	BAÑO	2 AÑOS (92 CM)	13.19
10165.69	Toalla	Turquesa	BAÑO	2 AÑOS (92 CM)	13.19
10165.69	Toalla	Turquesa	BAÑO	2 AÑOS (92 CM)	13.19
10165.69	Toalla	Turquesa	BAÑO	2 AÑOS (92 CM)	13.19
1275.36	Conj. Pantalon corto camiseta	Topo	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	13.79
1275.36	Conj. pantalon corto camiseta	Topo	BEBE NIÑO 0 A 18 MESES	6-9 MESES (75 CM)	13.79
1275.36	Conj. pantalon corto camiseta	Topo	BEBE NIÑO 0 A 18 MESES	12 MESES (80 CM)	13.79
1286.48	Conj. short gasa	Ceramica	BEBE NIÑA 0 A18 MESES	0-1 MESES (55 CM)	14.99
1286.48	Conj. short gasa	Ceramica	BEBE NIÑA 0 A18 MESES	1-2 MESES (60 CM)	14.99
1286.48	Conj. short gasa	Ceramica	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	14.99
1286.48	Conj. short gasa	Ceramica	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	14.99
1286.48	Conj. short gasa	Ceramica	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	14.99
1602.62	Conj. pelele	Aqua	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	14.99
1602.62	Conj. pelele	Aqua	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	14.99
1614.18	Pelele y gorro plana	Cielo	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	13.19
1614.18	Pelele y gorro plana	Cielo	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	13.19
1614.18	Pelele y gorro plana	Cielo	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	13.19
1614.18	Pelele y gorro plana	Cielo	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	13.19
1614.18	Pelele y gorro plana	Cielo	BEBE NIÑO 0 A 18 MESES	18 MESES (86 CM)	13.19
1614.19	Pelele y gorro plana	Terracota	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	13.79
1614.19	Pelele y gorro plana	Terracota	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	13.79
1614.19	Pelele y gorro plana	Terracota	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	13.79
1621.32	Conj. peto camiseta	Topo	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	16.79
1621.32	Conj. peto camiseta	Topo	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	16.79
1621.32	Conj. peto camiseta	Topo	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	16.79
1626.58	Conj. punto 4 piezas	Alga	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	19.79
1629.73	Pelele peto	Plata	BEBE NIÑO 0 A 18 MESES	0-0 MESES (50 CM)	13.79
1629.73	Pelele peto	Plata	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	13.79
1629.73	Pelele peto	Plata	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	13.79
1629.73	Pelele peto	Plata	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	13.79
1629.73	Pelele peto	Plata	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	13.79
1630.73	Conj. punto 4 piezas	Plata	BEBE NIÑO 0 A 18 MESES	0-0 MESES (50 CM)	17.99
1630.73	Conj. punto 4 piezas	Plata	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	17.99
1630.73	Conj. punto 4 piezas	Plata	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	17.99
1630.73	Conj. punto 4 piezas	Plata	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	17.99
1630.73	Conj. punto 4 piezas	Plata	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	17.99
1637.66	Conj. peto tricot	Ceramica	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	20.99
1637.66	Conj. peto tricot	Ceramica	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	20.99
1640.47	Set 2 bodies y 2 shorts	Alga	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	21.59
1640.47	Set 2 bodies y 2 shorts	Alga	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	21.59
1640.47	Set 2 bodies y 2 shorts	Alga	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	21.59
1640.47	Set 2 bodies y 2 shorts	Alga	BEBE NIÑA 0 A18 MESES	18 MESES (86 CM)	21.59
1642.56	Conj. pant. corto 4 piezas	Trigo	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	22.79
1642.56	Conj. pant. corto 4 piezas	Trigo	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	22.79
1642.56	Conj. pant. corto 4 piezas	Trigo	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	22.79
1642.57	Conj. pant. corto 4 piezas	Aqua	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	22.19
1642.57	Conj. pant. corto 4 piezas	Aqua	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	22.19
1651.23	Pelele peto corto	Trigo	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	17.99
1651.23	Pelele peto corto	Trigo	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	17.99
1651.23	Pelele peto corto	Trigo	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	17.99
1651.23	Pelele peto corto	Trigo	BEBE NIÑO 0 A 18 MESES	12 MESES (80 CM)	17.99
1727.79	Set regalo pijama corto	Blanco	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	14.99
1727.79	Set regalo pijama corto	Blanco	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	14.99
1727.79	Set regalo pijama corto	Blanco	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	14.99
1803.97	Vestido	Terracota	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	16.19
1803.97	Vestido	Terracota	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	16.19
1803.97	Vestido	Terracota	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	16.19
1803.97	Vestido	Terracota	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	16.19
1805.42	Vestido gasa	Rosa baby	BEBE NIÑA 0 A18 MESES	0-1 MESES (55 CM)	16.79
1805.42	Vestido gasa	Rosa baby	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	16.79
1805.42	Vestido gasa	Rosa baby	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	16.79
1805.42	Vestido gasa	Rosa baby	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	16.79
9046.59	Set 6 calcetines	Rosas	COMPLEMENTOS	0M	8.39
9046.59	Set 6 calcetines	Rosas	COMPLEMENTOS	6M	8.39
9046.59	Set 6 calcetines	Rosas	COMPLEMENTOS	12M	8.39
9046.61	Set 6 calcetines	Verdes	COMPLEMENTOS	0M	8.39
9046.61	Set 6 calcetines	Verdes	COMPLEMENTOS	3M	8.39
9046.61	Set 6 calcetines	Verdes	COMPLEMENTOS	6M	8.39
9046.61	Set 6 calcetines	Verdes	COMPLEMENTOS	12M	8.39
1607.11	Pelele peto y gorro	Sunny	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	16.19
1607.11	Pelele peto y gorro	Sunny	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	16.19
1607.11	Pelele peto y gorro	Sunny	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	16.19
1607.11	Pelele peto y gorro	Sunny	BEBE NIÑO 0 A 18 MESES	12 MESES (80 CM)	16.19
1611.14	Peto y gorro	Terracota	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	16.14
1611.14	Peto y gorro	Terracota	BEBE NIÑO 0 A 18 MESES	6-9 MESES (75 CM)	16.14
1614.20	Pelele y gorro plana	Manzana	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	13.74
1614.20	Pelele y gorro plana	Manzana	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	13.74
1614.20	Pelele y gorro plana	Manzana	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	13.74
1614.20	Pelele y gorro plana	Manzana	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	13.74
1614.20	Pelele y gorro plana	Manzana	BEBE NIÑO 0 A 18 MESES	12 MESES (80 CM)	13.74
1617.24	Conj. baño y gorro	Velero	BAÑO	4-6 MESES (70 CM)	15.90
1624.52	Conj. peto y gorro punto	Manzana	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	16.14
1624.52	Conj. peto y gorro punto	Manzana	BEBE NIÑO 0 A 18 MESES	6-9 MESES (75 CM)	16.14
1624.52	Conj. peto y gorro punto	Manzana	BEBE NIÑO 0 A 18 MESES	12 MESES (80 CM)	16.14
1624.52	Conj. peto y gorro punto	Manzana	BEBE NIÑO 0 A 18 MESES	18 MESES (86 CM)	16.14
1627.76	Conj. punto 4 piezas	Rojo	BEBE NIÑO 0 A 18 MESES	6-9 MESES (75 CM)	19.14
1627.76	Conj. punto 4 piezas	Rojo	BEBE NIÑO 0 A 18 MESES	12 MESES (80 CM)	19.14
1632.24	Pelele con gorro	Rosa	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	13.79
1632.24	Pelele con gorro	Rosa	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	13.79
1632.24	Pelele con gorro	Rosa	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	13.79
1639.71	Conj. punto 4 piezas	Sunny	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	21.54
1639.71	Conj. punto 4 piezas	Sunny	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	21.54
1639.71	Conj. punto 4 piezas	Sunny	BEBE NIÑA 0 A18 MESES	18 MESES (86 CM)	21.54
1643.76	Conj. punto 4 piezas sisa	Rojo	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	20.34
1643.76	Conj. punto 4 piezas sisa	Rojo	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	20.34
1643.76	Conj. punto 4 piezas sisa	Rojo	BEBE NIÑA 0 A18 MESES	18 MESES (86 CM)	20.34
1645.06	Peto corto	Arroz	BEBE NIÑO 0 A 18 MESES	0-1 MESES (55 CM)	9.59
1645.06	Peto corto	Arroz	BEBE NIÑO 0 A 18 MESES	1-2 MESES (60 CM)	9.59
1645.06	Peto corto	Arroz	BEBE NIÑO 0 A 18 MESES	32-4 M	9.59
1645.06	Peto corto	Arroz	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	9.59
1650.29	Peto corto y gorro	Claro	BEBE NIÑO 0 A 18 MESES	2-4 MESES (65 CM)	16.14
1650.29	Peto corto y gorro	Claro	BEBE NIÑO 0 A 18 MESES	4-6 MESES (70 CM)	16.14
1650.29	Peto corto y gorro	Claro	BEBE NIÑO 0 A 18 MESES	6-9 MESES (75 CM)	16.14
1737.82	Bañador y gorro	Hawaii	BAÑO	4-6 MESES (70 CM)	14.94
1814.31	Vestido sersucker	Lagoon	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	19.14
1814.31	Vestido sersucker	Lagoon	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	19.14
1820.31	Conj. falda	Lagoon	BEBE NIÑA 0 A18 MESES	2-4 MESES (65 CM)	17.34
1820.31	Conj. falda	Lagoon	BEBE NIÑA 0 A18 MESES	4-6 MESES (70 CM)	17.34
1820.31	Conj. falda	Lagoon	BEBE NIÑA 0 A18 MESES	6-9 MESES (75 CM)	17.34
1820.31	Conj. falda	Lagoon	BEBE NIÑA 0 A18 MESES	12 MESES (80 CM)	17.34
9088.54	Mochila playa	Velero	BAÑO	Única	10.74
9088.54	Mochila playa	Velero	BAÑO	Única	10.74
9124.94	Colchoneta	Antracita	COMPLEMENTOS	Única	15.90
9124.96	Colchoneta	Dusty blue	COMPLEMENTOS	Única	15.90
19085.94	Bolso estampado	Antracita	COMPLEMENTOS	Única	28.79
19093.25	Neceser multifuncion	Dusty blue	COMPLEMENTOS	Única	11.34
19093.27	Neceser multifuncion	Antracita	COMPLEMENTOS	Única	11.34`;

const lines = rawData.trim().split('\n').slice(1);
const products = new Map();

for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length < 6) continue;
  
  const [codigo, descripcion, color, categoria, talla, precioFinal] = parts;
  const code = codigo.trim();
  
  if (!products.has(code)) {
    let finalCategory = categoria.trim();
    const brand = 'Mayoral';

    const pvpNum = parseFloat(precioFinal.trim());
    
    // We don't have the original price, so we'll reverse calculate it or just use the discounted as original
    // Since it's a 40% discount, original = discounted / 0.6
    const originalPrice = pvpNum / 0.6;

    products.set(code, {
      code,
      name: descripcion.trim(),
      description: '100% algodón', // Default description
      color: color.trim(),
      original_price: originalPrice,
      discounted_price: pvpNum,
      brand,
      category: finalCategory,
      sizes_stock: {},
      image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2070&auto=format&fit=crop' // Placeholder
    });
  }

  const prod = products.get(code);
  prod.sizes_stock[talla.trim()] = 5; 
}

let sql = '-- Seed data for Mayoral Catalog\n';
sql += 'INSERT INTO products (code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url) VALUES\n';

const values = [];
for (const p of products.values()) {
  const sizesJson = JSON.stringify(p.sizes_stock).replace(/'/g, "''");
  const name = p.name.replace(/'/g, "''");
  const desc = p.description.replace(/'/g, "''");
  const color = p.color.replace(/'/g, "''");
  const brand = p.brand.replace(/'/g, "''");
  const cat = p.category.replace(/'/g, "''");
  
  values.push(`('${p.code}', '${name}', '${desc}', '${color}', ${p.original_price.toFixed(2)}, ${p.discounted_price.toFixed(2)}, '${brand}', '${cat}', '${sizesJson}'::jsonb, '${p.image_url}')`);
}

sql += values.join(',\n') + '\nON CONFLICT (code) DO UPDATE SET sizes_stock = EXCLUDED.sizes_stock, original_price = EXCLUDED.original_price, discounted_price = EXCLUDED.discounted_price, color = EXCLUDED.color, category = EXCLUDED.category, name = EXCLUDED.name, brand = EXCLUDED.brand;\n';

fs.writeFileSync('mayoral_seed.sql', sql);
console.log('SQL generated successfully in mayoral_seed.sql');

// Also update products.json
const existingProductsData = fs.readFileSync('products.json', 'utf8');
const existingProducts = JSON.parse(existingProductsData);

// Merge products
const newProductsArray = Array.from(products.values());
for (const newProd of newProductsArray) {
  const existingIndex = existingProducts.findIndex(p => p.code === newProd.code);
  if (existingIndex >= 0) {
    existingProducts[existingIndex] = newProd;
  } else {
    existingProducts.push(newProd);
  }
}

fs.writeFileSync('products.json', JSON.stringify(existingProducts, null, 2));
console.log('JSON generated successfully in products.json');
