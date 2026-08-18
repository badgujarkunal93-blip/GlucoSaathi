# 🏥 OhioT1DM Dataset Access Instructions & Integration Protocol

---

## 1. Dataset Overview
* **Dataset**: OhioT1DM Dataset for Blood Glucose Level Prediction (2018 / 2020 releases).
* **Principal Investigators**: Cindy Marling & Razvan Bunescu, Ohio University.
* **Official URL**: [https://webpages.charlotte.edu/rbunescu/data/ohiot1dm/OhioT1DM-dataset.html](https://webpages.charlotte.edu/rbunescu/data/ohiot1dm/OhioT1DM-dataset.html)
* **Cohort**: 12 T1D patients wearing Medtronic Enlite CGMs and Empatica E4 wristbands over 8 weeks.

---

## 2. Authorized Access Protocol
The OhioT1DM dataset is strictly protected under a formal Data Transfer Agreement (DTA). Automated scraping or unauthorized redistribution is strictly prohibited.

To integrate OhioT1DM into GlucoSaathi:
1. Submit an official request to the dataset maintainers with your institutional email and research rationale.
2. Sign the Ohio University Data Use Agreement.
3. Upon receiving access credentials, place the XML data files in this directory:
   ```
   ml/data/external/ohiot1dm/
   ├── 559-ws-training.xml
   ├── 559-ws-testing.xml
   ├── ...
   ```
4. Run the OhioT1DM parser:
   ```bash
   ml/.venv/bin/python -m src.data.parsers.ohiot1dm_parser
   ```
