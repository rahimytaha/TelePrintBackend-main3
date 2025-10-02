/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Color_Klebe_Buchstabe");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { cost: 0, key: "weiß", CMYK: "17-14-9-0", Hex: "#D4DBE8" },
        { cost: 0, key: "gold gelb", CMYK: "0-39-100-0", Hex: "#FF9C00" },
        { cost: 0, key: "gelb", CMYK: "0-23-100-0", Hex: "#FFC400" },
        { cost: 0, key: "Shellgelb", CMYK: "1-14-100-5", Hex: "#F0D000" },
        { cost: 0, key: "Schwefelgelb", CMYK: "6-2-90-3", Hex: "#E9F219" },
        { cost: 0, key: "Purpurrot", CMYK: "16-100-72-66", Hex: "#F0D000" },
        { cost: 0, key: "Burgundy", CMYK: "12-100-76-57", Hex: "#8B0018" },
        { cost: 0, key: "Dunkelrot", CMYK: "9-100-84-40", Hex: "#8B0018" },
        { cost: 0, key: "Rot", CMYK: "5-100-92-22", Hex: "#BD0010" },
        { cost: 0, key: "Hellrot", CMYK: "2-96-100-0", Hex: "#FA0A00" },
        { cost: 0, key: "Orangerot", CMYK: "1-88-100-5", Hex: "#F01D00" },
        { cost: 0, key: "Hellrotorange", CMYK: "0-68-100-0", Hex: "#FF5200" },
        { cost: 0, key: "Pastell-orange", CMYK: "0-66-100-0", Hex: "#FF5700" },
        { cost: 0, key: "Purple", CMYK: "87-93-6-20", Hex: "#1B0EC0" },
        { cost: 0, key: "Violett", CMYK: "65-87-13-30", Hex: "#3E179B" },
        { cost: 0, key: "Lavendel", CMYK: "62-67-4-1", Hex: "#6053F2" },
        { cost: 0, key: "Flieder", CMYK: "31-48-6-1", Hex: "#AE83ED" },
        { cost: 0, key: "Pink", CMYK: "5-90-21-15", Hex: "#CE16AB" },
        { cost: 0, key: "Hellrosa", CMYK: "0-61-1-0", Hex: "#FF63FC" },
        { cost: 0, key: "Tiefseeblau", CMYK: "94-76-29-67", Hex: "#05143C" },
        { cost: 0, key: "Stahlblau", CMYK: "100-88-17-65", Hex: "#000B4A" },
        { cost: 0, key: "Dunkelblau", CMYK: "94-75-14-46", Hex: "#05164D" },
        { cost: 0, key: "Kobaltblau", CMYK: "100-90-6-27", Hex: "#0013AF" },
        { cost: 0, key: "Königsblau", CMYK: "100-88-4-18", Hex: "#0019C9" },
        { cost: 0, key: "Brillantblau", CMYK: "100-93-0-0", Hex: "#0012FF" },
        { cost: 0, key: "Blau", CMYK: "100-69-6-30", Hex: "#0037A8" },
        { cost: 0, key: "Verkehrsblau", CMYK: "100-70-3-16", Hex: "#0040D0" },
        { cost: 0, key: "Enzianblau", CMYK: "100-62-6-26", Hex: "#0048B1" },
        { cost: 0, key: "Enzian", CMYK: "100-64-0-0", Hex: "#005CFF" },
        { cost: 0, key: "Azurblau", CMYK: "100-57-0-0", Hex: "#006EFF" },
        { cost: 0, key: "Himmelblau", CMYK: "100-41-0-1", Hex: "#0095FC" },
        { cost: 0, key: "Hellblau", CMYK: "91-24-3-7", Hex: "#15B4E6" },
        { cost: 0, key: "Lichtblau", CMYK: "71-20-5-2", Hex: "#48C8ED" },
        { cost: 0, key: "Türkisblau", CMYK: "99-5-34-23", Hex: "#02BB82" },
        { cost: 0, key: "Türkis", CMYK: "93-2-43-6", Hex: "#11EB89" },
        { cost: 0, key: "Mint", CMYK: "60-0-38-0", Hex: "#66FF9E" },
        { cost: 0, key: "Dunkelgrün", CMYK: "91-32-80-65", Hex: "#083D12" },
        { cost: 0, key: "Waldgrün", CMYK: "97-14-75-57", Hex: "#035E1B" },
        { cost: 0, key: "Grün", CMYK: "100-6-79-27", Hex: "#00AF27" },
        { cost: 0, key: "Grasgrün", CMYK: "100-5-85-24", Hex: "#00B81D" },
        { cost: 0, key: "Hellgrün", CMYK: "94-4-93-17", Hex: "#0DCB0F" },
        { cost: 0, key: "Gelbgrün", CMYK: "74-2-100-9", Hex: "#3CE300" },
        { cost: 0, key: "Lindgrün", CMYK: "62-3-97-11", Hex: "#56DC07" },
        { cost: 0, key: "Braun", CMYK: "53-65-77-67", Hex: "#281D13" },
        { cost: 0, key: "Haselnussbraun", CMYK: "9-66-90-27", Hex: "#A93F13" },
        { cost: 0, key: "Hellbraun", CMYK: "26-39-63-21", Hex: "#957B4B" },
        { cost: 0, key: "Beige", CMYK: "19-20-39-6", Hex: "#C2C092" },
        { cost: 0, key: "Crème", CMYK: "8-16-48-2", Hex: "#E6D282" },
        { cost: 0, key: "Schwarz", CMYK: "85-74-62-86", Hex: "#05090E" },
        { cost: 0, key: "Dunkelgrau", CMYK: "63-52-50-48", Hex: "#314042" },
        { cost: 0, key: "Grau", CMYK: "52-36-39-25", Hex: "#5C7A75" },
        { cost: 0, key: "Telegrau", CMYK: "48-36-34-20", Hex: "#6A8387" },
        { cost: 0, key: "Mittelgrau", CMYK: "45-32-36-18", Hex: "#738E86" },
        { cost: 0, key: "Hellgrau", CMYK: "28-18-21-4", Hex: "#B0C9C1" },
        { cost: 0, key: "Silbergrau", CMYK: "55-44-41-32", Hex: "#4E6166" },
        { cost: 0, key: "Gold", CMYK: "36-41-78-45", Hex: "#5A531F" },
        { cost: 0, key: "Kupfer", CMYK: "32-63-85-54", Hex: "#502B12" },
      ];

      await Promise.all(
        DATA.map(async (obj) => {
          const thisStatus = await this.findOneByCondition(obj);
          if (!thisStatus) {
            const createInventoryStatus = await this.createObject(obj);
          }
        }),
      );
    } catch (error) {
      return error;
    }
  }
})(Model);
