import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import {COLORS} from '../../../constants/theme';

const Tips = () => {
  // const colorScheme = useColorScheme();
  // const isDarkMode = colorScheme === 'dark';

  const [tipIndex, setTipIndex] = useState(0);
  const [tips, setTips] = useState([
    "💧 Water your plants regularly, but don't overwater them.",
    '🌱 Choose the right soil for your plants. Different plants have different soil requirements.',
    "☀️ Provide adequate sunlight according to the plant's needs.",
    '🌿 Mulch around plants to retain moisture and suppress weeds.',
    '🔄 Rotate crops annually to prevent soil depletion and disease buildup.',
    '✂️ Prune plants regularly to encourage healthy growth and fruit production.',
    '🌿 Use organic fertilizers to enrich the soil without harmful chemicals.',
    '🐛 Monitor and control pests and diseases promptly to prevent damage to your crops.',
    '🌼 Plant companion crops to naturally deter pests and enhance growth.',
    '🧹 Keep your garden clean and free of debris to reduce pest habitats.',
    '🌿 Provide support for climbing plants to prevent them from bending or breaking.',
    '🌍 Know your hardiness zone and select plants suitable for your climate.',
    '🌱 Start seeds indoors before transplanting them outside for an early start.',
    '📅 Keep track of planting dates and crop rotations for better planning.',
    '🛏️ Use raised beds to improve drainage and soil quality.',
    '💦 Install drip irrigation systems to deliver water directly to plant roots efficiently.',
    '♻️ Apply a layer of compost regularly to replenish nutrients in the soil.',
    '📏 Keep an eye on the pH level of your soil and adjust if necessary for optimal plant growth.',
    '🍅 Harvest fruits and vegetables when they are ripe to encourage continuous production.',
    '🌱 Use natural methods like neem oil or insecticidal soap for pest control.',
    '🐞 Encourage beneficial insects like ladybugs and lacewings to help control pests naturally.',
    '🌿 Keep weeds under control to prevent them from competing with your plants for nutrients.',
    '💨 Provide adequate spacing between plants to allow for proper air circulation.',
    '❄️ Protect young plants from harsh weather conditions like frost or extreme heat.',
    '🌱 Use floating row covers to protect plants from pests while allowing sunlight and moisture to reach them.',
    '🌿 Use a trellis or stake for vining plants to keep them off the ground and prevent diseases.',
    '🔄 Practice crop rotation to prevent the buildup of pests and diseases in the soil.',
    '🌿 Use companion planting techniques to maximize space and deter pests naturally.',
    '🪱 Introduce beneficial nematodes to the soil to control harmful pests like root maggots.',
    '🌾 Utilize cover crops during the off-season to improve soil health and prevent erosion.',
    '🌧️ Use a rain gauge to monitor rainfall and adjust watering accordingly.',
    '🛠️ Keep garden tools clean and sharp to prevent the spread of diseases between plants.',
    '🌬️ Install windbreaks to protect plants from strong winds and reduce water evaporation.',
    " 🚫 Avoid working in the garden when it's wet to prevent soil compaction.",
    '🌿 Use organic weed control methods like hand-pulling or mulching rather than chemical herbicides.',
    '🌱 Encourage biodiversity in your garden to create a balanced ecosystem.',
    '🌾 Apply a layer of straw or hay mulch to retain moisture and suppress weeds.',
    '🛏️ Use raised beds or containers for gardening in areas with poor soil quality.',
    '🌿 Keep plants well-fed with balanced nutrition to promote healthy growth and development.',
    '🧪 Test your soil periodically to ensure it has the proper balance of nutrients.',
    '🌸 Use companion planting to attract pollinators like bees and butterflies to your garden.',
    '🌱 Protect young seedlings from pests with physical barriers like cloches or netting.',
    '🐞 Keep an eye out for beneficial insects like ladybugs and praying mantises and avoid harming them.',
    '🌿 Incorporate organic matter into the soil regularly to improve its structure and fertility.',
    '💧 Use drip irrigation or soaker hoses to water plants at the root zone and minimize water waste.',
    '⚠️ Avoid over-fertilizing plants, as this can lead to nutrient imbalances and damage.',
    '🌾 Keep garden beds well-mulched to conserve moisture and suppress weeds.',
    '🌱 Use floating row covers to protect plants from pests and extend the growing season.',
    '🌼 Plant native species to attract beneficial insects and support local ecosystems.',
    '🌿 Use reflective mulches around plants to deter aphids and other pests.',
    '🍎 Prune fruit trees in late winter or early spring to promote healthy growth and fruit production.',
    '🌸 Plant flowers that attract pollinators to increase fruit and vegetable yields.',
    '🐞 Use natural predators like ladybugs and lacewings to control aphids and other pests.',
    '🔄 Avoid planting susceptible crops in the same area year after year to prevent disease buildup.',
    '🌱 Use organic pest control methods like diatomaceous earth or insecticidal soap.',
    '🌿 Protect plants from extreme temperatures with row covers or shade cloth.',
    '🌱 Use compost tea to fertilize plants and improve soil health naturally.',
    '🧼 Practice good hygiene by cleaning tools and removing diseased plant material.',
    '🌱 Consider using raised beds or containers if you have poor soil or limited space.',
    '🔄 Use crop rotation to prevent the depletion of soil nutrients and minimize pest problems.',
    '🐦 Encourage natural predators like birds and frogs to control garden pests.',
    '🌿 Use companion planting to repel pests and attract beneficial insects.',
    '💨 Provide adequate spacing between plants to prevent overcrowding and promote air circulation.',
    '🌱 Use row covers to protect plants from frost and extend the growing season.',
    '💧 Water plants deeply and less frequently to encourage deep root growth.',
    '💦 Use drip irrigation or soaker hoses to water plants efficiently and reduce water waste.',
    '🌿 Use organic mulches like straw or leaves to conserve moisture and suppress weeds.',
    '🔄 Use crop rotation to prevent the buildup of pests and diseases in the soil.',
    '🧪 Test your soil regularly and amend it as needed to maintain proper pH and nutrient levels.',
    '🌿 Provide support for tall or vining plants to prevent them from bending or breaking.',
    '🌱 Use floating row covers to protect plants from pests while allowing air and moisture to circulate.',
    '🌸 Plant flowers that attract pollinators to increase fruit and vegetable yields.',
    '🐜 Use natural pest control methods like diatomaceous earth or beneficial nematodes.',
    '🌿 Mulch around plants to conserve moisture, suppress weeds, and regulate soil temperature.',
    '🌱 Use companion planting to deter pests and attract beneficial insects.',
    '🌿 Protect plants from extreme temperatures with shade cloth or row covers.',
    '✂️ Prune plants regularly to promote healthy growth and fruit production.',
    '🌱 Plant cover crops to improve soil fertility and prevent erosion during the off-season.',
    '🌱 Provide adequate support for tall or heavy fruit-bearing plants.',
    '💦 Use drip irrigation or soaker hoses to water plants at the root zone and minimize water waste.',
    '🌿 Use reflective mulches to deter pests like aphids and whiteflies.',
    '🐞 Introduce beneficial insects like ladybugs and lacewings to control garden pests.',
    '🌿 Protect plants from pests and diseases by practicing good garden hygiene.',
    '🌱 Encourage biodiversity in your garden to create a balanced ecosystem.',
    '🌿 Use organic fertilizers to nourish plants and improve soil health.',
    '🛏️ Use raised beds or containers for gardening in areas with poor soil quality.',
    '🌱 Protect young plants from pests and extreme weather conditions with cloches or row covers.',
    '🌾 Keep garden beds well-mulched to conserve moisture and suppress weeds.',
    '🌸 Plant native species to attract pollinators and support local wildlife.',
    '🌱 Use row covers to protect plants from frost and extend the growing season.',
    '💧 Water plants deeply and less frequently to encourage deep root growth.',
    '🕵️‍♂️ Monitor plants regularly for signs of pests or diseases and take appropriate action.',
    '🌱 Use floating row covers to protect plants from pests while allowing air and moisture to circulate.',
    '🐜 Use organic pest control methods like neem oil or insecticidal soap.',
    '🔄 Practice crop rotation to prevent the buildup of pests and diseases in the soil.',
    '🌸 Plant flowers that attract pollinators to increase fruit and vegetable yields.',
    '🌿 Use companion planting to maximize space and deter pests naturally.',
    '🐦 Encourage natural predators like birds and beneficial insects to control garden pests.',
    '💨 Provide adequate spacing between plants to prevent overcrowding and promote air circulation.',
    '🌿 Enjoy the process of growing plants and appreciate the beauty of nature in your garden.',
  ]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTipIndex(randomIndex);
  }, []);

  return (
    <View style={[styles.container]}>
      {/* <GradientText
        text="Tips for You"
        colors={['green', 'black']}
        style={styles.text}
      /> */}
      <Text style={styles.text}>Tips for You</Text>
      <View style={[styles.tipBox]}>
        <Icon name="lightbulb-on-outline" size={60} color="#FFA000" />
        <Text style={[styles.tipText]}>
          {tips[tipIndex]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    rowGap: 30,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  tipBox: {
    backgroundColor: '#fff',
    padding: 40,
    margin: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: COLORS.primary,
    borderWidth: 4
  },
  tipBoxDark: {
    backgroundColor: '#333333',
  },
  tipText: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
    color: '#000',
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  tipTextDark: {
    color: '#FFFFFF',
  },
  containerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  text: {
    fontSize: 50,
    fontWeight: '800',
    fontFamily: "poppins",
    color: COLORS.primary
  },
});

export default Tips;
