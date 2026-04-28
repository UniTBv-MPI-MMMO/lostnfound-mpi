# LostNFound - Campus Connect

> O platforma digitala centralizata pentru raportarea si recuperarea obiectelor pierdute in campus, eliminand haosul postarilor de pe retelele sociale.

# 1. Descriere si obiective
Aplicatia rezolva problema pierderii obiectelor personale in mediul universitar prin oferirea unui sistem structurat de gestiune a anunturilor.
- **Obiectiv 1:** Reducerea timpului de recuperare a obiectelor prin filtrare pe categorii si locatii.
- **Obiectiv 2:** Facilitarea contactului direct si sigur intre cel care gaseste un obiect si proprietar.
- **Public tinta:** Studentii si personalul administrativ al universitatii.

# 2. Echipa si roluri
| Nume student | Rol principal | GitHub username |
|--------------|---------------|-----------------|
| Menyhárt Loránd | QA | @lorandme |
| Mocanu Emanuel-Andrei | Backend | @mocanuEmanuel |
| Mocanu Andreea | Frontend | @andreeamoc |
| Oprea Maria-Isabel | DevOps | @isaoprea |

# 3. Arhitectura si tehnologii
- **Backend:** Python FastAPI
- **Database:** PostgreSQL
- **Frontend:** React + Vite
- **Infrastructure:** Docker si GitHub Actions

# 4. Cerinte
Pentru rularea aplicatiei ai nevoie de:
- Docker si Docker Compose, pentru varianta recomandata
- sau Python 3.10+ si Node.js 22+, pentru rulare locala

# 5. Configurare initiala
1. Cloneaza repository-ul.

```bash
git clone https://github.com/UniTBv-MPI-MMMO/lostnfound-mpi.git
cd lostnfound-mpi
```

2. Creeaza un fisier `.env` in radacina proiectului cu credentiale pentru PostgreSQL.

```env
DB_USER=admin
DB_PASSWORD=adminpassword
```

Valorile pot fi schimbate, dar trebuie sa ramana identice cu cele folosite la pornirea containerelor.

# 6. Rulare cu Docker Compose
Asta este varianta recomandata pentru pornire rapida.

```bash
docker compose up --build
```

Aplicatia va fi disponibila la:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

La prima pornire, containerul PostgreSQL ruleaza scriptul de initializare din `Backend/db-init/init.sql`, care creeaza tabela `items` si adauga date de test.

Pentru oprire:

```bash
docker compose down
```

# 7. Rulare locala fara Docker
Porneste fiecare componenta in terminal separat.

## Backend
```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set DATABASE_URL=postgresql://admin:adminpassword@localhost:5432/app_db
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend
```bash
cd Frontend
npm install
npm run dev -- --host
```

In varianta locala, backend-ul trebuie sa poata accesa o baza PostgreSQL pe `localhost:5432` folosind baza de date `app_db`.

# 8. Testare backend
Pentru testele automate ale backend-ului poti folosi:

```bash
docker compose run --rm backend pytest
```

# 9. Structura proiectului
- `Backend/` contine API-ul FastAPI, schema bazei de date si testele.
- `Frontend/` contine aplicatia React cu interfata de utilizator.
- `docker-compose.yml` porneste backend-ul, frontend-ul si PostgreSQL.
