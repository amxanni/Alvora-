import React from "react";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section>
        <nav>
          <div>
            <h1>Alvora</h1>
            <button onClick={() => (window.location.href = "/auth")}>
              Intră în cont
            </button>
          </div>
        </nav>
        <div>
          <div>
            <div>
              <div>
                <h2>Conectează-te cu colegii tăi</h2>
                <p>
                  Alvora este platforma dedicată studenților unde poți găsi
                  parteneri de studiu, tutori și colaboratori pentru proiecte academice.
                </p>
              </div>
              <div>
                <button onClick={() => (window.location.href = "/auth")}>
                  Înscrie-te acum
                </button>
              </div>
            </div>
            <div>
              <img
                alt="Studenți colaborând împreună"
                src="/lovable-uploads/68b8f4de-039a-4027-91c5-8169b037e861.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h3>De ce să alegi Alvora?</h3>
            <p>
              Platforma care transformă modul în care studenții colaborează și se sprijină reciproc
            </p>
          </div>
          <div>
            <div>
              <div>
                <div>Icon 1</div>
                <h4>Siguranță garantată</h4>
                <p>
                  Acces exclusiv cu e-mail instituțional pentru studenții verificați
                </p>
              </div>
            </div>
            <div>
              <div>
                <div>Icon 2</div>
                <h4>Grupuri de studiu</h4>
                <p>
                  Creează sau alătură-te grupurilor bazate pe cursuri și interese comune
                </p>
              </div>
            </div>
            <div>
              <div>
                <div>Icon 3</div>
                <h4>Chat integrat</h4>
                <p>
                  Comunicare directă între studenți pentru schimb de materiale și planificare
                </p>
              </div>
            </div>
            <div>
              <div>
                <div>Icon 4</div>
                <h4>Profil personalizat</h4>
                <p>
                  Prezintă-ți facultatea, anul și interesele pentru a găsi parteneri potriviți
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section>
        <div>
          <div>
            <h3>Cum funcționează?</h3>
            <p>Trei pași simpli către o experiență universitară mai bună</p>
          </div>
          <div>
            <div>
              <div>1</div>
              <h4>Înregistrează-te</h4>
              <p>
                Folosește e-mailul tău instituțional pentru a crea un cont securizat
              </p>
            </div>
            <div>
              <div>2</div>
              <h4>Creează-ți profilul</h4>
              <p>
                Adaugă informații despre facultate, cursuri și interesele tale academice
              </p>
            </div>
            <div>
              <div>3</div>
              <h4>Conectează-te</h4>
              <p>
                Găsește parteneri de studiu și alătură-te grupurilor care te interesează
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section>
        <div>
          <div>
            <h3>Cine folosește Alvora?</h3>
            <p>
              Platforma este perfectă pentru toți studenții universitari
            </p>
          </div>
          <div>
            <div>
              <h4>Studenți din primul an</h4>
              <p>
                Integrează-te rapid în mediul universitar și creează-ți un cerc de prieteni cu interese comune
              </p>
            </div>
            <div>
              <h4>Studenți internaționali</h4>
              <p>
                Adaptează-te mai ușor la noul mediu și colaborează eficient cu colegii locali
              </p>
            </div>
            <div>
              <h4>Studenți performanți</h4>
              <p>
                Devino mentor pentru colegii mai tineri și împărtășește-ți experiența și cunoștințele
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h3>
            Începe să construiești conexiuni academice valoroase astăzi
          </h3>
          <p>
            Alătură-te comunității Alvora și transformă-ți experiența universitară
          </p>
          <button onClick={() => (window.location.href = "/auth")}>
            Creează cont gratuit
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <div>
            <div>
              <h4>Alvora</h4>
              <p>
                Platforma studenților pentru colaborare academică
              </p>
            </div>
            <div>
              <p>© 2024 Alvora. Toate drepturile rezervate.</p>
              <p>Universitatea Româno-Americană</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;