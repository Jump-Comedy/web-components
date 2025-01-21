import _ from "lodash";
export default function getUniqueShowtimes(variants) {
  return _.uniqBy(variants, (v) => v.startsat);
}
