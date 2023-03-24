import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  signoffContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  logo: {
    width: 84,
    height: 85,
    marginRight: "auto",
    marginLeft: 0,
  },
  signoff: {
    width: "75%",
    flexDirection: "column",
    color: "#666666",
    justifyContent: "space-between",
  },
  signIndicationText: {
    width: "100%",
    fontSize: 10,
  },
  date: {
    fontSize: 10,
    marginTop: 20,
  },
  authorizedByText: {
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 20,
  },
  authorization: {
    flexDirection: "row",
    borderColor: "#e0e0e0",
    borderTopWidth: 1,
    justifyContent: "space-between",
  },
});

const date = new Date();
const POSignoff = () => (
  <View style={styles.signoffContainer}>
    {/* Disabling here because React PDF Image doesn't have an alt prop */}
    {/* eslint-disable-next-line */}
    <Image style={styles.logo} src={"/images/re-logo-black.jpg"} />
    <View style={styles.signoff}>
      <Text style={styles.signIndicationText}>Sign here:</Text>
      <View style={styles.authorization}>
        <Text style={styles.authorizedByText}>
          Authorized by _________________
        </Text>
        <Text style={styles.date}>{date.toDateString()}</Text>
      </View>
    </View>
  </View>
);

export default POSignoff;
