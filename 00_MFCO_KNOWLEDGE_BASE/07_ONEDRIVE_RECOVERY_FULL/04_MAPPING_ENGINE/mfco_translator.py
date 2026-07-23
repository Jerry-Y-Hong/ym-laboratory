# -*- coding: utf-8 -*-
import pandas as pd
import os
import re

class MFCOTranslator:
    def __init__(self, root_dir=r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"):
        self.root_dir = root_dir
        self.matrix_dir = os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS")
        self.kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
        
        # Load Multilingual Dictionary
        self.df_dict = None
        dict_path = os.path.join(self.matrix_dir, "M04-12_MULTILINGUAL_DICTIONARY_v1.0.xlsx")
        if os.path.exists(dict_path):
            self.df_dict = pd.read_excel(dict_path)
        else:
            try:
                self.df_dict = pd.read_excel(self.kb_path, sheet_name="MULTILINGUAL_DICTIONARY")
            except:
                pass
                
        # Build lookup tables
        self.ko_to_key = {}
        self.key_to_lang = {}
        
        if self.df_dict is not None:
            for _, row in self.df_dict.iterrows():
                key = str(row['KEY']).strip()
                ko_val = str(row['ko']).strip()
                self.ko_to_key[ko_val] = key
                
                self.key_to_lang[key] = {
                    "ko": ko_val,
                    "en": str(row['en']).strip(),
                    "zh": str(row['zh']).strip(),
                    "ja": str(row['ja']).strip(),
                    "es": str(row['es']).strip(),
                    "de": str(row['de']).strip(),
                    "ar": str(row['ar']).strip(),
                }
                
        # Pre-defined sentences for high-quality mock translation
        self.sentence_db = {
            "en": {
                "조리 단계 후반 5분 전에 키트를 투입하여 유효성분 우려냄.": 
                    "Insert the kit 5 minutes before the end of the cooking stage to extract active ingredients.",
                "조리 시작 시 육수용 티백으로 함께 끓이거나, 볶음/조림 소스에 분말 혼합하여 사용.": 
                    "Boil together with a tea bag for broth at the start of cooking, or mix powder into the stir-fry/braising sauce.",
                "밥물로 미리 우려내거나 탕류 밑국물로 사용하여 15분 이상 충분히 가열.": 
                    "Pre-brew with rice water or use as a soup stock and heat sufficiently for more than 15 minutes.",
                "조리 소스에 직접 용해하거나 요리 완성 직전 골고루 뿌려 혼합.": 
                    "Dissolve directly in the cooking sauce or sprinkle evenly and mix just before the dish is completed.",
                "요리 완성 후 가볍게 섞어 내거나 샐러드 드레싱, 특선 음료에 혼합.": 
                    "Mix lightly after the dish is completed, or mix with salad dressing or special beverages.",
                # Sample recipe steps
                "두부는 먹기 좋은 크기로 썰어서 준비합니다. 톳은 물에 불리지 않고 바로 끓여도 됩니다":
                    "Slice tofu into bite-sized pieces. Hijiki Seaweed does not need soaking and can be boiled immediately.",
                "청양고추와 홍고추는 어슷 썰고 쪽파도 썰어서 준비합니다. 물의 양은 과 간은 본인 식성에 따라 준비하시면 됩니다":
                    "Slice hot peppers diagonally and chop green onions. Adjust water volume and seasoning to your taste.",
                "물을 2.5컵 부어준 후에 톳을 먼저 넣고 끓여줍니다.":
                    "Pour 2.5 cups of water, add Hijiki Seaweed first, and bring to a boil.",
                "톳이 끓으면 두부를 넣고 한소끔 더 끓여줍니다.":
                    "When the seaweed boils, add tofu and simmer for a while.",
                "끓이면서 생기는 거품은 걷어내줍니다 그래야 더욱 깔끔한 국물을 드실 수 있어요.":
                    "Skim off any foam while boiling for a cleaner broth.",
                "썰어놓은 쪽파와 청양고추를 넣고 계란물을 돌려가며 부어줍니다.":
                    "Add chopped green onions and hot peppers, then slowly pour in the beaten egg.",
                "계란물을 부어준 후에 불을 끄고 잠시 젓지 않고 그대로 둡니다 홍고추도 넣어줍니다.":
                    "After pouring the egg, turn off the heat and let it sit without stirring. Add red pepper.",
                "대접에 한 대접 가득 떠서 밥 없이 국 한 그릇으로 한 끼 해결할 수 있어요.":
                    "Serve a full bowl; it can be enjoyed as a light meal even without rice.",
                "청양고추를 넣어 칼칼하면서 바다향 가득한 두부 톳국 요즘 같은 날씨에 국한 그릇만 있으면 한기 잘 먹었다 할 수 있어요.":
                    "A spicy and oceanic tofu and seaweed soup, perfect for warming up in this weather.",
                "손질된 장어 3마리를 2~3cm길이로 잘라 흐르는 물에 씻어 체에 건져 물기를 빼 줍니다.":
                    "Cut 3 cleaned eels into 2-3 cm pieces, rinse under running water, and drain in a sieve.",
                "달군 냄비에 식용유 1큰술, 참기름 1큰술을 두르고 다진마늘 1큰술을 넣고 먼저 볶아 줍니다.":
                    "Heat 1 tbsp oil and 1 tbsp sesame oil in a pot, add 1 tbsp minced garlic, and stir-fry.",
                "고추가루 2큰술을 넣고 타지않게 볶아 주세요.":
                    "Add 2 tbsp red pepper powder and stir-fry carefully to prevent burning.",
                "준비한 장어살을 넣고 볶아 줍니다.":
                    "Add the prepared eel pieces and stir-fry.",
                "장어가 익어 탱글하게 살이 말리면 다시마 멸치육수 6컵을 붓고 끓여 줍니다. 국물을 고르게 팔팔 끓여주세요.":
                    "When the eel is cooked and firm, pour in 6 cups of kelp-anchovy stock and bring to a boil.",
                "손질한 콩나물 2줌을 넣고. 새송이버섯 1개를 곱게 채썰어 넣고 끓여 줍니다.":
                    "Add 2 handfuls of cleaned bean sprouts. Shred 1 king oyster mushroom and boil.",
                "국물이 끓으면 국간장 3큰술로 간을 해 줍니다.":
                    "When the soup boils, season with 3 tbsp soup soy sauce.",
                "국물이 고르게 끓으면 어슷썬 대파 1대를 넣고 후추약간으로 마무리간으 봐주세요, 전혀 비리지않고 칼칼한 장어국이 완성입니다.":
                    "Once boiling evenly, add 1 sliced green onion, finish with a pinch of pepper. A non-fishy, spicy eel soup is ready.",
                "끓는 물에 다시마를 넣고 5분만 끓인 후 다시마는 건져내세요.":
                    "Put kelp in boiling water, boil for 5 minutes, and then remove the kelp.",
                "미역은 불려두고 계란은 멍울없이 풀어둬요.":
                    "Soak seaweed and beat the egg until smooth.",
                "부추는 5cm로 잘라두고 청양고추, 대파는 어슷하게 썰어둡니다.":
                    "Cut chives into 5 cm lengths and diagonally slice hot peppers and green onions.",
                "뚝배기에 찬밥과 미역, 굴을 차례로 담고 다시마육수를 부어서 끓여줍니다.":
                    "Place cold rice, seaweed, and oyster in a clay pot, pour kelp stock, and boil.",
                "끓기 시작하면 달걀을 줄알쳐 넣고, 청양고추와 대파를 넣고 살짝 익혀요.":
                    "When it starts to boil, drizzle in the beaten egg, add hot peppers and green onions, and simmer briefly.",
                "깔끔하게 소금으로 간을 맞춰주세요.":
                    "Season cleanly with salt."
            },
            "es": {
                "조리 단계 후반 5분 전에 키트를 투입하여 유효성분 우려냄.":
                    "Inserte el kit 5 minutos antes del final de la etapa de cocción para extraer los ingredientes activos.",
                "조리 시작 시 육수용 티백으로 함께 끓이거나, 볶음/조림 소스에 분말 혼합하여 사용.":
                    "Hierva junto con una bolsa de té para caldo al comienzo de la cocción, o mezcle el polvo en la salsa para saltear/estofar.",
                "밥물로 미리 우려내거나 탕류 밑국물로 사용하여 15분 이상 충분히 가열.":
                    "Prepare previamente con agua de arroz o úselo como caldo de sopa y caliente lo suficiente durante más de 15 minutos.",
                "조리 소스에 직접 용해하거나 요리 완성 직전 골고루 뿌려 혼합.":
                    "Disolver directamente en la salsa de cocción o espolvorear uniformemente y mezclar justo antes de que se complete el plato.",
                "요리 완성 후 가볍게 섞어 내거나 샐러드 드레싱, 특선 음료에 혼합.":
                    "Mezclar ligeramente después de completar el plato, o mezclar con aderezo para ensalada o bebidas especiales.",
                "두부는 먹기 좋은 크기로 썰어서 준비합니다. 톳은 물에 불리지 않고 바로 끓여도 됩니다":
                    "Corte el tofu en trozos del tamaño de un bocado. El Alga Hijiki no necesita remojo y se puede hervir inmediatamente.",
                "청양고추와 홍고추는 어슷 썰고 쪽파도 썰어서 준비합니다. 물의 양은 과 간은 본인 식성에 따라 준비하시면 됩니다":
                    "Corte los chiles en diagonal y pique las cebolletas. Ajuste el volumen de agua y condimentos a su gusto.",
                "물을 2.5컵 부어준 후에 톳을 먼저 넣고 끓여줍니다.":
                    "Vierta 2.5 tazas de agua, agregue el Alga Hijiki primero y deje hervir.",
                "톳이 끓으면 두부를 넣고 한소끔 더 끓여줍니다.":
                    "Cuando el alga hierva, agregue el tofu y cocine a fuego lento por un momento.",
                "끓이면서 생기는 거품은 걷어내줍니다 그래야 더욱 깔끔한 국물을 드실 수 있어요.":
                    "Retire la espuma mientras hierve para obtener un caldo más limpio.",
                "썰어놓은 쪽파와 청양고추를 넣고 계란물을 돌려가며 부어줍니다.":
                    "Agregue las cebolletas picadas y los chiles, luego vierta lentamente el huevo batido.",
                "계란물을 부어준 후에 불을 끄고 잠시 젓지 않고 그대로 둡니다 홍고추도 넣어줍니다.":
                    "Después de verter el huevo, apague el fuego y deje reposar sin revolver. Agregue el pimiento rojo.",
                "대접에 한 대접 가득 떠서 밥 없이 국 한 그릇으로 한 끼 해결할 수 있어요.":
                    "Sirva un tazón lleno; se puede disfrutar como una comida ligera incluso sin arroz.",
                "청양고추를 넣어 칼칼하면서 바다향 가득한 두부 톳국 요즘 같은 날씨에 국한 그릇만 있으면 한기 잘 먹었다 할 수 있어요.":
                    "Una sopa picante y oceánica de tofu y algas, perfecta para calentarse con este clima.",
                "손질된 장어 3마리를 2~3cm길이로 잘라 흐르는 물에 씻어 체에 건져 물기를 빼 줍니다.":
                    "Corte 3 anguilas limpias en trozos de 2-3 cm, enjuáguelas bajo el chorro de agua y escúrralas en un colador.",
                "달군 냄비에 식용유 1큰술, 참기름 1큰술을 두르고 다진마늘 1큰술을 넣고 먼저 볶아 줍니다.":
                    "Caliente 1 cucharada de aceite y 1 cucharada de aceite de sésamo en una olla, agregue 1 cucharada de ajo picado y saltee.",
                "고추가루 2큰술을 넣고 타지않게 볶아 주세요.":
                    "Agregue 2 cucharadas de chile en polvo y saltee con cuidado para evitar que se queme.",
                "준비한 장어살을 넣고 볶아 줍니다.":
                    "Agregue los trozos de anguila preparados y saltee.",
                "장어가 익어 탱글하게 살이 말리면 다시마 멸치육수 6컵을 붓고 끓여 줍니다. 국물을 고르게 팔팔 끓여주세요.":
                    "Cuando la anguila esté cocida y firme, vierta 6 tazas de caldo de alga y anchoa y deje hervir.",
                "손질한 콩나물 2줌을 넣고. 새송이버섯 1개를 곱게 채썰어 넣고 끓여 줍니다.":
                    "Agregue 2 puñados de brotes de soja limpios. Pique 1 hongo eringii y hierva.",
                "국물이 끓으면 국간장 3큰술로 간을 해 줍니다.":
                    "Cuando la sopa hierva, sazone con 3 cucharadas de salsa de soja para sopa.",
                "국물이 고르게 끓으면 어슷썬 대파 1대를 넣고 후추약간으로 마무리간으 봐주세요, 전혀 비리지않고 칼칼한 장어국이 완성입니다.":
                    "Una vez que hierva uniformemente, agregue 1 cebolleta picada, termine con una pizca de pimienta. Una sopa de anguila picante está lista.",
                "끓는 물에 다시마를 넣고 5분만 끓인 후 다시마는 건져내세요.":
                    "Ponga el alga kelp en agua hirviendo, hierva durante 5 minutos y luego retire el alga.",
                "미역은 불려두고 계란은 멍울없이 풀어둬요.":
                    "Remoje las algas y bata el huevo hasta que quede suave.",
                "부추는 5cm로 잘라두고 청양고추, 대파는 어슷하게 썰어둡니다.":
                    "Corte el cebollino en trozos de 5 cm y corte en diagonal los chiles y las cebolletas.",
                "뚝배기에 찬밥과 미역, 굴을 차례로 담고 다시마육수를 부어서 끓여줍니다.":
                    "Coloque arroz frío, algas y ostra en una olla de barro, vierta el caldo de alga y hierva.",
                "끓기 시작하면 달걀을 줄알쳐 넣고, 청양고추와 대파를 넣고 살짝 익혀요.":
                    "Cuando empiece a hervir, vierta el huevo batido, agregue chiles y cebolletas, y cocine a fuego lento brevemente.",
                "깔끔하게 소금으로 간을 맞춰주세요.":
                    "Sazone limpiamente con sal."
            },
            "de": {
                "조리 단계 후반 5분 전에 키트를 투입하여 유효성분 우려냄.":
                    "Setzen Sie das Kit 5 Minuten vor dem Ende der Kochstufe ein, um die Wirkstoffe zu extrahieren.",
                "조리 시작 시 육수용 티백으로 함께 끓이거나, 볶음/조림 소스에 분말 혼합하여 사용.":
                    "Kochen Sie zu Beginn des Garvorgangs zusammen mit einem Teebeutel für die Brühe, oder mischen Sie Pulver in die Rühr-/Schmorsoße.",
                "밥물로 미리 우려내거나 탕류 밑국물로 사용하여 15분 이상 충분히 가열.":
                    "Mit Reiswasser vorbrühen oder als Suppenbrühe verwenden und ausreichend für mehr als 15 Minuten erhitzen.",
                "조리 소스에 직접 용해하거나 요리 완성 직전 골고루 뿌려 혼합.":
                    "Direkt in der Soße auflösen oder kurz vor der Fertigstellung des Gerichts gleichmäßig darüber streuen und vermischen.",
                "요리 완성 후 가볍게 섞어 내거나 샐러드 드레싱, 특선 음료에 혼합.":
                    "Nach Fertigstellung des Gerichts leicht vermischen oder mit Salatdressing oder Spezialgetränken mischen.",
                "두부는 먹기 좋은 크기로 썰어서 준비합니다. 톳은 물에 불리지 않고 바로 끓여도 됩니다":
                    "Tofu in mundgerechte Stücke schneiden. Hijiki-Alge muss nicht eingeweicht werden und kann sofort gekocht werden.",
                "청양고추와 홍고추는 어슷 썰고 쪽파도 썰어서 준비합니다. 물의 양은 과 간은 본인 식성에 따라 준비하시면 됩니다":
                    "Chili schräg schneiden und Frühlingszwiebeln hacken. Passen Sie die Wassermenge und die Gewürze Ihrem Geschmack an.",
                "물을 2.5컵 부어준 후에 톳을 먼저 넣고 끓여줍니다.":
                    "Gießen Sie 2.5 Tassen Wasser ein, geben Sie zuerst die Hijiki-Alge hinzu und bringen Sie es zum Kochen.",
                "톳이 끓으면 두부를 넣고 한소끔 더 끓여줍니다.":
                    "Sobald die Alge kocht, den Tofu hinzufügen und kurz köcheln lassen.",
                "끓이면서 생기는 거품은 걷어내줍니다 그래야 더욱 깔끔한 국물을 드실 수 있어요.":
                    "Schöpfen Sie den Schaum beim Kochen ab, um eine klarere Brühe zu erhalten.",
                "썰어놓은 쪽파와 청양고추를 넣고 계란물을 돌려가며 부어줍니다.":
                    "Gehackte Frühlingszwiebeln und Chili hinzufügen, dann langsam das verquirlte Ei eingießen.",
                "계란물을 부어준 후에 불을 끄고 잠시 젓지 않고 그대로 둡니다 홍고추도 넣어줍니다.":
                    "Nach dem Eingießen des Eies die Hitze ausschalten und stehen lassen, ohne umzurühren. Rote Paprika hinzufügen.",
                "대접에 한 대접 가득 떠서 밥 없이 국 한 그릇으로 한 끼 해결할 수 있어요.":
                    "Servieren Sie eine volle Schüssel; kann auch ohne Reis als leichte Mahlzeit genossen werden.",
                "청양고추를 넣어 칼칼하면서 바다향 가득한 두부 톳국 요즘 같은 날씨에 국한 그릇만 있으면 한기 잘 먹었다 할 수 있어요.":
                    "Eine scharfe Tofu-Algen-Suppe mit Meeresaroma, ideal zum Aufwärmen bei diesem Wetter.",
                "손질된 장어 3마리를 2~3cm길이로 잘라 흐르는 물에 씻어 체에 건져 물기를 빼 줍니다.":
                    "Schneiden Sie 3 gesäuberte Aale in 2-3 cm Stücke, spülen Sie sie unter fließendem Wasser ab und lassen Sie sie in einem Sieb abtropfen.",
                "달군 냄비에 식용유 1큰술, 참기름 1큰술을 두르고 다진마늘 1큰술을 넣고 먼저 볶아 줍니다.":
                    "Erhitzen Sie 1 EL Pflanzenöl und 1 EL Sesamöl in einem Topf, fügen Sie 1 EL gehackten Knoblauch hinzu und braten Sie ihn an.",
                "고추가루 2큰술을 넣고 타지않게 볶아 주세요.":
                    "Geben Sie 2 EL Chilipulver hinzu und braten Sie es vorsichtig an, damit es nicht verbrennt.",
                "준비한 장어살을 넣고 볶아 줍니다.":
                    "Fügen Sie die vorbereiteten Aalstücke hinzu und braten Sie sie an.",
                "장어가 익어 탱글하게 살이 말리면 다시마 멸치육수 6컵을 붓고 끓여 줍니다. 국물을 고르게 팔팔 끓여주세요.":
                    "Wenn der Aal gar und fest ist, gießen Sie 6 Tassen Kombu-Sardellen-Brühe ein und bringen Sie es zum Kochen.",
                "손질한 콩나물 2줌을 넣고. 새송이버섯 1개를 곱게 채썰어 넣고 끓여 줍니다.":
                    "Fügen Sie 2 Hände voll gereinigte Sojasprossen hinzu. Schneiden Sie 1 Kräuterseitling in feine Streifen und kochen Sie ihn.",
                "국물이 끓으면 국간장 3큰술로 간을 해 줍니다.":
                    "Sobald die Suppe kocht, würzen Sie sie mit 3 EL Suppen-Sojasauce.",
                "국물이 고르게 끓으면 어슷썬 대파 1대를 넣고 후추약간으로 마무리간으 봐주세요, 전혀 비리지않고 칼칼한 장어국이 완성입니다.":
                    "Sobald es gleichmäßig kocht, fügen Sie 1 geschnittene Frühlingszwiebel hinzu, runden Sie es mit einer Prise Pfeffer ab. Eine scharfe Aalsuppe ist fertig.",
                "끓는 물에 다시마를 넣고 5분만 끓인 후 다시마는 건져내세요.":
                    "Geben Sie den Seetang in kochendes Wasser, kochen Sie ihn 5 Minuten lang und entfernen Sie ihn dann.",
                "미역은 불려두고 계란은 멍울없이 풀어둬요.":
                    "Weichen Sie den Seetang ein und verquirlen Sie das Ei klumpenfrei.",
                "부추는 5cm로 잘라두고 청양고추, 대파는 어슷하게 썰어둡니다.":
                    "Schneiden Sie den Schnittlauch in 5 cm lange Stücke und schneiden Sie Chilis und Frühlingszwiebeln schräg.",
                "뚝배기에 찬밥과 미역, 굴을 차례로 담고 다시마육수를 부어서 끓여줍니다.":
                    "Geben Sie kalten Reis, Seetang und Auster in einen Tontopf, gießen Sie Seetangbrühe auf und bringen Sie es zum Kochen.",
                "끓기 시작하면 달걀을 줄알쳐 넣고, 청양고추와 대파를 넣고 살짝 익혀요.":
                    "Wenn es zu kochen beginnt, gießen Sie das verquirlte Ei hinein, fügen Sie Chilis und Frühlingszwiebeln hinzu und lassen Sie es kurz köcheln.",
                "깔끔하게 소금으로 간을 맞춰주세요.":
                    "Schmecken Sie es sauber mit Salz ab."
            },
            "ar": {
                "조리 단계 후반 5분 전에 키트를 투입하여 유효성분 우려냄.":
                    "أدخل المجموعة قبل 5 دقائق من نهاية مرحلة الطهي لاستخراج المكونات النشطة.",
                "조리 시작 시 육수용 티백으로 함께 끓이거나, 볶음/조림 소스에 분말 혼합하여 사용.":
                    "يُغلى مع كيس شاي للمرق في بداية الطهي، أو يخلط المسحوق في صلصة القلي/الطهي ببطء.",
                "밥물로 미리 우려내거나 탕류 밑국물로 사용하여 15분 이상 충분히 가열.":
                    "يُحضر مسبقًا بماء الأرز أو يُستخدم كمرق حساء ويُسخن جيدًا لأكثر من 15 دقيقة.",
                "조리 소스에 직접 용해하거나 요리 완성 직전 골고루 뿌려 혼합.":
                    "يذوب مباشرة في صلصة الطهي أو يرش بالتساوي ويخلط قبل اكتمال الطبق مباشرة.",
                "요리 완성 후 가볍게 섞어 내거나 샐러드 드레싱, 특선 음료에 혼합.":
                    "يُمزج برفق بعد اكتمال الطبق، أو يُمزج مع تتبيلة السلطة أو المشروبات الخاصة.",
                "두부는 먹기 좋은 크기로 썰어서 준비합니다. 톳은 물에 불리지 않고 바로 끓여도 됩니다":
                    "قطعي التوفو إلى قطع صغيرة الحجم. هيجيكي لا يحتاج إلى نقع ويمكن غليه على الفور.",
                "청양고추와 홍고추는 어슷 썰고 쪽파도 썰어서 준비합니다. 물의 양은 과 간은 본인 식성에 따라 준비하시면 됩니다":
                    "قطعي الفلفل الحار بشكل مائل وافرمي البصل الأخضر. اضبطي كمية الماء والتوابل حسب ذوقك.",
                "물을 2.5컵 부어준 후에 톳을 먼저 넣고 끓여줍니다.":
                    "صبي كوبين ونصف من الماء، ثم أضيفي الهيجيكي أولاً واتركيه حتى يغلي.",
                "톳이 끓으면 두부를 넣고 한소끔 더 끓여줍니다.":
                    "عندما يغلي الهيجيكي، أضيفي التوفو واتركيه ينضج قليلاً.",
                "끓이면서 생기는 거품은 걷어내줍니다 그래야 더욱 깔끔한 국물을 드실 수 있어요.":
                    "أزيلي الرغوة أثناء الغليان للحصول على مرق أنقى.",
                "썰어놓은 쪽파와 청양고추를 넣고 계란물을 돌려가며 부어줍니다.":
                    "أضيفي البصل الأخضر المفروم والفلفل الحار، ثم صبي البيض المخفوق ببطء.",
                "계란물을 부어준 후에 불을 끄고 잠시 젓지 않고 그대로 둡니다 홍고추도 넣어줍니다.":
                    "بعد صب البيض، أطفئي النار واتركيه دون تحريك. أضيفي الفلفل الأحمر.",
                "대접에 한 대접 가득 떠서 밥 없이 국 한 그릇으로 한 끼 해결할 수 있어요.":
                    "قدمي وعاءً كاملاً؛ يمكن الاستمتاع به كوجبة خفيفة حتى بدون أرز.",
                "청양고추를 넣어 칼칼하면서 바다향 가득한 두부 톳국 요즘 같은 날씨에 국한 그릇만 있으면 한기 잘 먹었다 할 수 있어요.":
                    "حساء التوفو والأعشاب البحرية الحار والبحري، مثالي للتدفئة في هذا الطقس.",
                "손질된 장어 3마리를 2~3cm길이로 잘라 흐르는 물에 씻어 체에 건져 물기를 빼 줍니다.":
                    "اقطع 3 ثعابين بحر نظيفة إلى قطع بطول 2-3 سم، واشطفها تحت الماء الجاري، ثم صفها في مصفاة.",
                "달군 냄비에 식용유 1큰술, 참기름 1큰술을 두르고 다진마늘 1큰술을 넣고 먼저 볶아 줍니다.":
                    "سخن ملعقة كبيرة من الزيت وملعقة كبيرة من زيت السمسم في قدر، ثم أضف ملعقة كبيرة من الثوم المفروم واقليه.",
                "고추가루 2큰술을 넣고 타지않게 볶아 주세요.":
                    "أضف ملعقتين كبيرتين من مسحوق الفلفل الأحمر واقليهما بحذر لتجنب الاحتراق.",
                "준비한 장어살을 넣고 볶아 줍니다.":
                    "أضف قطع ثعبان البحر المحضرة واقلها.",
                "장어가 익어 탱글하게 살이 말리면 다시마 멸치육수 6컵을 붓고 끓여 줍니다. 국물을 고르게 팔팔 끓여주세요.":
                    "عندما ينضج ثعبان البحر ويتماسك، صب 6 أكواب من مرق عشب البحر والأنشوجة واتركه يغلي.",
                "손질한 콩나물 2줌을 넣고. 새송이버섯 1개를 곱게 채썰어 넣고 끓여 줍니다.":
                    "أضف حفنتين من براعم الفاصوليا النظيفة. قطع حبة فطر المحار الملكي لشرائح رفيعة واغلها.",
                "국물이 끓으면 국간장 3큰술로 간을 해 줍니다.":
                    "عندما يغلي الحساء، تبله بثلاث ملاعق كبيرة من صلصة صويا الحساء.",
                "국물이 고르게 끓으면 어슷썬 대파 1대를 넣고 후추약간으로 마무리간으 봐주세요, 전혀 비리지않고 칼칼한 장어국이 완성입니다.":
                    "بمجرد الغليان بالتساوي، أضف بصلة خضراء مقطعة، وانتهِ برشة فلفل. حساء ثعبان البحر الحار اللذيذ جاهز.",
                "끓는 물에 다시마를 넣고 5분만 끓인 후 다시마는 건져내세요.":
                    "ضع عشب البحر في الماء المغلي، واغله لمدة 5 دقائق، ثم أزل عشب البحر.",
                "미역은 불려두고 계란은 멍울없이 풀어둬요.":
                    "انقع عشب البحر المخفف واخفق البيض حتى يصبح ناعمًا.",
                "부추는 5cm로 잘라두고 청양고추, 대파는 어슷하게 썰어둡니다.":
                    "اقطع الثوم المعمر إلى أطوال 5 سم وقطع الفلفل الحار والبصل الأخضر بشكل مائل.",
                "뚝배기에 찬밥과 미역, 굴을 차례로 담고 다시마육수를 부어서 끓여줍니다.":
                    "ضع الأرز البارد وعشب البحر والمحار في وعاء فخاري، وصب مرق عشب البحر، واغله.",
                "끓기 시작하면 달걀을 줄알쳐 넣고, 청양고추와 대파를 넣고 살짝 익혀요.":
                    "عندما يبدأ في الغليان، رشي البيض المخفوق، وأضيفي الفلفل الحار والبصل الأخضر، واتركيه ينضج لفترة وجيزة.",
                "깔끔하게 소금으로 간을 맞춰주세요.":
                    "تبله بالملح فقط للحصول على طعم نظيف."
            }
        }

    def translate_term(self, term_ko, lang):
        """
        Translates a single term using the dictionary.
        """
        if lang == "ko" or not lang:
            return term_ko
            
        term_clean = str(term_ko).strip()
        if term_clean in self.ko_to_key:
            key = self.ko_to_key[term_clean]
            if key in self.key_to_lang:
                return self.key_to_lang[key].get(lang, term_ko)
        return term_ko

    def isolate_core_terms(self, text):
        """
        Replaces Korean terms in text with tags __KEY__ to isolate them from translation APIs.
        Uses temporary placeholders to prevent nested tag substitutions.
        """
        if not isinstance(text, str) or not text.strip():
            return text, []
            
        # Sort keys by length descending to match longer phrases first
        sorted_terms = sorted(self.ko_to_key.keys(), key=len, reverse=True)
        
        isolated_text = text
        replacements = []
        placeholders = {}
        
        for i, term in enumerate(sorted_terms):
            if term in isolated_text:
                key = self.ko_to_key[term]
                placeholder = f"[[[PLACEHOLDER{i}]]]"
                isolated_text = isolated_text.replace(term, placeholder)
                placeholders[placeholder] = f"___{key}___"
                replacements.append((f"___{key}___", key))
                
        # Restore placeholders to final tags
        for placeholder, tag in placeholders.items():
            isolated_text = isolated_text.replace(placeholder, tag)
            
        return isolated_text, replacements

    def restore_core_terms(self, translated_text, lang):
        """
        Restores tags in translated text back to the target language's verified terminology.
        """
        if not isinstance(translated_text, str) or not translated_text.strip():
            return translated_text
            
        restored_text = translated_text
        
        # Look for tag patterns (___RC01___, ___SF012___, etc.)
        tags_found = re.findall(r"___([^\n_]+?)___", restored_text)
        
        for key in tags_found:
            tag = f"___{key}___"
            # If it's a code key in our dict
            if key in self.key_to_lang:
                verified_trans = self.key_to_lang[key].get(lang, self.key_to_lang[key]["ko"])
            else:
                # If the key itself is a term and not a code, try to find it
                if key in self.ko_to_key:
                    k_code = self.ko_to_key[key]
                    verified_trans = self.key_to_lang[k_code].get(lang, key)
                else:
                    verified_trans = key # fallback
            restored_text = restored_text.replace(tag, verified_trans)
            
        return restored_text

    def translate_reasoning_trace(self, text, lang):
        """
        Translates dynamic English reasoning trace logs into target languages.
        """
        solar_terms = {
            "망종": {"en": "Mangjong", "es": "Mangjong", "de": "Mangjong", "ar": "مانغجونغ"},
            "동지": {"en": "Dongji", "es": "Dongji", "de": "Dongji", "ar": "دونغجي"},
            "여름": {"en": "Summer", "es": "Verano", "de": "Sommer", "ar": "الصيف"},
            "겨울": {"en": "Winter", "es": "Invierno", "de": "Winter", "ar": "الشتاء"}
        }
        
        # 1. Inferred Solar Term from date '...': ...
        m = re.match(r"Inferred Solar Term from date '([^']+)': (.+)", text)
        if m:
            dt, term = m.group(1), m.group(2)
            trans_term = solar_terms.get(term, {}).get(lang, term)
            if lang == "en":
                return f"Inferred Solar Term from date '{dt}': {trans_term}"
            elif lang == "es":
                return f"Término solar inferido a partir de la fecha '{dt}': {trans_term}"
            elif lang == "de":
                return f"Aus dem Datum '{dt}' abgeleitetes Solar-Term: {trans_term}"
            elif lang == "ar":
                return f"الرمز الشمسي المستنتج من التاريخ '{dt}': {trans_term}"
                
        # 2. Using direct Solar Term parameter: ...
        m = re.match(r"Using direct Solar Term parameter: (.+)", text)
        if m:
            term = m.group(1)
            trans_term = solar_terms.get(term, {}).get(lang, term)
            if lang == "en":
                return f"Using direct Solar Term parameter: {trans_term}"
            elif lang == "es":
                return f"Usando parámetro de término solar directo: {trans_term}"
            elif lang == "de":
                return f"Direkten Solar-Term-Parameter verwenden: {trans_term}"
            elif lang == "ar":
                return f"استخدام معلمة الرمز الشمسي المباشرة: {trans_term}"
                
        # 3. State ... has no mapped Cause. Defaulting to RC01 +1.0
        m = re.match(r"State ([A-Z0-9\-]+) has no mapped Cause\. Defaulting to RC01 \+1\.0", text)
        if m:
            sid = m.group(1)
            if lang == "en":
                return f"State {sid} has no mapped Cause. Defaulting to RC01 +1.0"
            elif lang == "es":
                return f"El estado {sid} no tiene causa asignada. Por defecto RC01 +1.0"
            elif lang == "de":
                return f"Zustand {sid} hat keine zugeordnete Ursache. Standardwert RC01 +1.0"
            elif lang == "ar":
                return f"الحالة {sid} ليس لها سبب محدد. الافتراضي RC01 +1.0"

        # 4. State ... matches vulnerability for Constitution ... Boosting weight by ...
        m = re.match(r"State ([A-Z0-9\-]+) matches vulnerability for Constitution ([A-Z]+)\. Boosting weight by 1 \+ ([\d\.]+) \* ([\d\.]+) = ([\d\.]+)", text)
        if m:
            sid, const, g, w, b = m.groups()
            const_trans = {"SE": "So-Eum", "SY": "So-Yang", "TE": "Tae-Eum", "TY": "Tae-Yang"}.get(const, const)
            if lang == "zh":
                const_trans = {"SE": "少阴人", "SY": "少阳人", "TE": "太阴人", "TY": "太阳人"}.get(const, const)
            elif lang == "ja":
                const_trans = {"SE": "少陰人", "SY": "少陽人", "TE": "太陰人", "TY": "太陽人"}.get(const, const)
            elif lang == "ar":
                const_trans = {"SE": "سو-أوم", "SY": "سو-يانغ", "TE": "تاي-أوم", "TY": "تاي-يانغ"}.get(const, const)
                
            if lang == "en":
                return f"State {sid} matches vulnerability for Constitution {const_trans}. Boosting weight by 1 + {g} * {w} = {b}"
            elif lang == "es":
                return f"El estado {sid} coincide con la vulnerabilidad de la constitución {const_trans}. Aumentando peso por 1 + {g} * {w} = {b}"
            elif lang == "de":
                return f"Zustand {sid} entspricht der Anfälligkeit für Konstitution {const_trans}. Gewicht wird erhöht um 1 + {g} * {w} = {b}"
            elif lang == "ar":
                return f"الحالة {sid} تطابق الحساسية للبنية الجسدية {const_trans}. زيادة الوزن بمقدار 1 + {g} * {w} = {b}"

        # 5. State ... -> Cause ...: Base weight ... * State Boost ... = ...
        m = re.match(r"State ([A-Z0-9\-]+) -> Cause ([A-Z0-9]+): Base weight ([\d\.]+) \* State Boost ([\d\.]+) = ([\d\.]+)", text)
        if m:
            sid, rc, w, b, s = m.groups()
            if lang == "en":
                return f"State {sid} -> Cause {rc}: Base weight {w} * State Boost {b} = {s}"
            elif lang == "es":
                return f"Estado {sid} -> Causa {rc}: Peso base {w} * Aumento de estado {b} = {s}"
            elif lang == "de":
                return f"Zustand {sid} -> Ursache {rc}: Basisgewicht {w} * Zustands-Boost {b} = {s}"
            elif lang == "ar":
                return f"الحالة {sid} -> السبب {rc}: الوزن الأساسي {w} * زيادة الحالة {b} = {s}"

        # 6. Organ ... -> Cause ...: Applying Zang-Fu correction x... (organ vulnerability weight: ...)
        m = re.match(r"Organ ([A-Z]+) -> Cause ([A-Z0-9]+): Applying Zang-Fu correction x([\d\.]+) \(organ vulnerability weight: ([\d\.]+)\)", text)
        if m:
            org, rc, mult, w = m.groups()
            org_trans = {"SPLEEN": "Spleen", "KIDNEY": "Kidney", "LIVER": "Liver", "HEART": "Heart", "LUNG": "Lung"}.get(org, org)
            if lang == "es":
                org_trans = {"SPLEEN": "Bazo", "KIDNEY": "Riñón", "LIVER": "Hígado", "HEART": "Corazón", "LUNG": "Pulmón"}.get(org, org)
            elif lang == "de":
                org_trans = {"SPLEEN": "Milz", "KIDNEY": "Niere", "LIVER": "Leber", "HEART": "Herz", "LUNG": "Lunge"}.get(org, org)
            elif lang == "ar":
                org_trans = {"SPLEEN": "الطحال", "KIDNEY": "الكلية", "LIVER": "الكبد", "HEART": "القلب", "LUNG": "الرئة"}.get(org, org)
                
            if lang == "en":
                return f"Organ {org_trans} -> Cause {rc}: Applying Zang-Fu correction x{mult} (organ vulnerability weight: {w})"
            elif lang == "es":
                return f"Órgano {org_trans} -> Causa {rc}: Aplicando corrección Zang-Fu x{mult} (peso de vulnerabilidad del órgano: {w})"
            elif lang == "de":
                return f"Organ {org_trans} -> Ursache {rc}: Zang-Fu-Korrektur anwenden x{mult} (Gewicht der Organanfälligkeit: {w})"
            elif lang == "ar":
                return f"العضو {org_trans} -> السبب {rc}: تطبيق تصحيح زانغ-فو x{mult} (وزن حساسية العضو: {w})"

        # 7. Solar Term '...' (...) -> Cause ...: Applying seasonal resonance x... (solar term weight: ...)
        m = re.match(r"Solar Term '([^']+)' \(([^)]+)\) -> Cause ([A-Z0-9]+): Applying seasonal resonance x([\d\.]+) \(solar term weight: ([\d\.]+)\)", text)
        if m:
            term, season, rc, mult, w = m.groups()
            trans_term = solar_terms.get(term, {}).get(lang, term)
            trans_season = solar_terms.get(season, {}).get(lang, season)
            if lang == "en":
                return f"Solar Term '{trans_term}' ({trans_season}) -> Cause {rc}: Applying seasonal resonance x{mult} (solar term weight: {w})"
            elif lang == "es":
                return f"Término solar '{trans_term}' ({trans_season}) -> Causa {rc}: Aplicando resonancia estacional x{mult} (peso del término solar: {w})"
            elif lang == "de":
                return f"Solar-Term '{trans_term}' ({trans_season}) -> Ursache {rc}: Saisonalen Resonanzeffekt anwenden x{mult} (Gewicht des Solar-Terms: {w})"
            elif lang == "ar":
                return f"الرمز الشمسي '{trans_term}' ({trans_season}) -> السبب {rc}: تطبيق الرنين الموسمي x{mult} (وزن الرمز الشمسي: {w})"

        # 8. Recipe candidates filtered by seasonal food category: ...
        m = re.match(r"Recipe candidates filtered by seasonal food category: (.+)", text)
        if m:
            cat = m.group(1)
            cat_trans = {"MEAT": "Meat", "FISH": "Fish", "VEGETABLE": "Vegetable", "GRAIN": "Grain", "FRUIT": "Fruit", "HERB": "Herb"}.get(cat, cat)
            if lang == "es":
                cat_trans = {"MEAT": "Carne", "FISH": "Pescado", "VEGETABLE": "Verdura", "GRAIN": "Grano", "FRUIT": "Fruta", "HERB": "Hierba"}.get(cat, cat)
            elif lang == "de":
                cat_trans = {"MEAT": "Fleisch", "FISH": "Fisch", "VEGETABLE": "Gemüse", "GRAIN": "Getreide", "FRUIT": "Frucht", "HERB": "Kraut"}.get(cat, cat)
            elif lang == "ar":
                cat_trans = {"MEAT": "لحوم", "FISH": "أسماك", "VEGETABLE": "خضروات", "GRAIN": "حبوب", "FRUIT": "فواكه", "HERB": "أعشاب"}.get(cat, cat)
                
            if lang == "en":
                return f"Recipe candidates filtered by seasonal food category: {cat_trans}"
            elif lang == "es":
                return f"Candidatos a recetas filtrados por categoría de alimento estacional: {cat_trans}"
            elif lang == "de":
                return f"Rezeptkandidaten gefiltert nach saisonaler Lebensmittelkategorie: {cat_trans}"
            elif lang == "ar":
                return f"تم تصفية وصفات الطهي المرشحة حسب فئة الغذاء الموسمي: {cat_trans}"

        # 9. All computed cause scores are 0. Fallback to RC01 with score 1.0
        if text == "All computed cause scores are 0. Fallback to RC01 with score 1.0":
            if lang == "en":
                return "All computed cause scores are 0. Fallback to RC01 with score 1.0"
            elif lang == "es":
                return "Todas las puntuaciones de causa calculadas son 0. Por defecto RC01 con puntuación 1.0"
            elif lang == "de":
                return "Alle berechneten Ursachenwerte sind 0. Standardwert RC01 mit Wert 1.0"
            elif lang == "ar":
                return "جميع درجات الأسباب المحسوبة تساوي 0. الافتراضي RC01 بدرجة 1.0"
                
        return None

    def translate_sentence(self, sentence, lang):
        if not sentence.strip():
            return sentence
            
        # Isolate Core Terms
        isolated_text, replacements = self.isolate_core_terms(sentence)
        
        # Check template DB
        # Reconstruct the template line to search in DB
        temp_tags = re.findall(r"___([^\n_]+?)___", isolated_text)
        template_line = isolated_text
        for key in temp_tags:
            tag = f"___{key}___"
            if key in self.key_to_lang:
                template_line = template_line.replace(tag, self.key_to_lang[key]["ko"])
            elif key in self.ko_to_key:
                template_line = template_line.replace(tag, key)
                
        translated_sentence = None
        if lang in self.sentence_db and template_line.strip() in self.sentence_db[lang]:
            translated_sentence = self.sentence_db[lang][template_line.strip()]
            # Re-apply tags to the translated sentence so we can restore them using target language
            for tag, key in replacements:
                ko_t = self.key_to_lang[key]["ko"]
                # Find target term for replacement
                target_term = self.key_to_lang[key].get(lang, ko_t)
                translated_sentence = re.sub(re.escape(target_term), tag, translated_sentence, flags=re.IGNORECASE)
        
        if translated_sentence is None:
            # Check if it has any Korean characters, excluding tags
            clean_for_korean_check = re.sub(r"___[^\n_]+?___", "", isolated_text)
            has_korean = any(ord(c) >= 0xac00 and ord(c) <= 0xd7a3 for c in clean_for_korean_check)
            if not has_korean:
                translated_sentence = isolated_text
            else:
                translated_sentence = f"[{lang.upper()} Translate] " + isolated_text
                
        # Restore Core Terms
        final_text = self.restore_core_terms(translated_sentence, lang)
        return final_text

    def translate_text(self, text, lang):
        """
        High-precision hybrid translation pipeline with core term isolation and structure parsing.
        """
        if lang == "ko" or not lang:
            return text
            
        if not isinstance(text, str) or not text.strip():
            return text
            
        # Try trace translator first
        trace_trans = self.translate_reasoning_trace(text, lang)
        if trace_trans is not None:
            return trace_trans
            
        # Split by \n first, then split by <br> within each line
        lines = text.split('\n')
        translated_lines = []
        
        for line in lines:
            if not line.strip():
                translated_lines.append("")
                continue
                
            sub_lines = line.split('<br>')
            translated_sub_lines = []
            
            for sub in sub_lines:
                if not sub.strip():
                    translated_sub_lines.append("")
                    continue
                
                # Check if it matches a list/step marker: e.g. "1. " or "1.  "
                marker_match = re.match(r"^(\d+\.\s*|- \s*|\* \s*|\[프렌차이즈 약선 업그레이드 조리법\]:\s*|\[프렌차이즈 약선 업그레이드 조리법\]:\n\s*)", sub)
                marker = ""
                content = sub
                if marker_match:
                    marker = marker_match.group(1)
                    content = sub[len(marker):]
                
                # Translate the content part
                translated_content = self.translate_sentence(content, lang)
                
                # Translate the marker itself if it's "프렌차이즈 약선 업그레이드 조리법"
                if "프렌차이즈 약선 업그레이드 조리법" in marker:
                    marker_key = "약선 업그레이드 조리법"
                    translated_marker_val = self.translate_term(marker_key, lang)
                    marker = f"[{translated_marker_val}]:\n"
                
                translated_sub_lines.append(marker + translated_content)
                
            translated_lines.append('<br>'.join(translated_sub_lines))
            
        translated_text = '\n'.join(translated_lines)
        return translated_text

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    translator = MFCOTranslator()
    
    # Test case: "보기" & "황기" translation correctness test
    test_korean = "조리 단계 후반 5분 전에 키트를 투입하여 유효성분 우려냄. 황기 사용."
    print("Original:", test_korean)
    
    for lang in ["en", "es", "de", "ar"]:
        trans = translator.translate_text(test_korean, lang)
        print(f"[{lang}]:", trans)
