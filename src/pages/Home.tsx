import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, LayoutDashboard, BookMarked, ShieldCheck, FlaskConical, Database, Users, BookOpen, Cpu, Lock, Layers } from "lucide-react";
import NeuralNetworkBg from "@/components/NeuralNetworkBg";
import { DRUGS } from "@/lib/drugInteractions";
import { GENERIC_COUNT, FORMULATION_COUNT } from "@/lib/drugFormulations";

const Home = () => (
  <div>
    <Helmet>
      <title>SUCYNTRA DDI Predictor — Evidence-Based Drug Interaction Checker</title>
      <meta name="description" content="Deterministic, literature-driven engine for Drug-Drug, Drug-Food, and Drug-Allergy interactions with geriatric Beers Criteria and anticholinergic burden scoring." />
      <link rel="canonical" href="https://sucyntraddip.lovable.app/" />
    </Helmet>

    {/* Hero - Enhanced */}
    <section className="hero-gradient relative overflow-hidden py-24 sm:py-32 px-4">
      <NeuralNetworkBg />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 animate-fade-in-up">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-white font-medium tracking-wide">Clinical Rules Engine · Deterministic Evidence Lookup</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient mb-6 tracking-tight text-center leading-tight">
          SUCYNTRA DDI PREDICTOR
        </h1>

        {/* Subheading */}
        <p className="text-white/90 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-center mb-10">
          A deterministic, literature-driven clinical engine that flags drug-drug, drug-food, drug-allergy and geriatric prescribing risks — mapped across {FORMULATION_COUNT}+ commercial brand formulations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/checker" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all text-base hover:scale-105">
            <Activity className="w-5 h-5" /> Run Interaction Check <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/25 transition-all text-base">
            <LayoutDashboard className="w-5 h-5" /> Patient Dashboard
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { i: Database, t: `${DRUGS.length}+ Molecules` },
            { i: ShieldCheck, t: `${FORMULATION_COUNT}+ Formulations` },
            { i: FlaskConical, t: "ADME Mapping" },
            { i: Users, t: "Beers Criteria" },
          ].map(({ i: Icon, t }) => (
            <div key={t} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-colors">
              <Icon className="w-4 h-4 text-white/90" />
              <span className="text-white/95 text-sm font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

  {/* Feature cards - Enhanced Layout */}
  <section className="px-4 py-20 max-w-6xl mx-auto">
    <div className="text-center mb-14">
      <div className="inline-block mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">Features</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-3">A Complete Clinical Workflow</h2>
      <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">From a single interaction lookup to comprehensive patient management — fully offline and fully auditable.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Feature
        to="/checker"
        icon={Activity}
        title="Interaction Checker"
        body="Drug-drug, drug-food and drug-allergy modes with structural ADME overlap and pharmacokinetic overlap timeline."
      />
      <Feature
        to="/dashboard"
        icon={LayoutDashboard}
        title="Patient Dashboard"
        body="Save patient profiles, track every prescription check, search history — all stored locally on your device."
      />
      <Feature
        to="/library"
        icon={BookMarked}
        title="Commercial Drug Library"
        body={`Browse ${GENERIC_COUNT} generic molecules across ${FORMULATION_COUNT}+ commercial brand formulations with clinical uses.`}
      />
    </div>
  </section>

    {/* About section — Improved design */}
    <section id="about" className="px-4 py-20 bg-gradient-to-b from-secondary/30 to-transparent border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">Why SUCYNTRA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">Deterministic, Not Predictive</h2>
          <p className="text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Built on transparent clinical rules — every interaction signal traces back to an explicit pharmacological mechanism. Nothing is inferred by black-box modeling, so every flag is auditable.
          </p>
        </div>

        {/* Core Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <AboutCard icon={Cpu} title="Deterministic Rules" body="Every decision is auditable against a primary clinical mechanism. Zero machine learning inference." />
          <AboutCard icon={Layers} title="ADME Mapping" body="Absorption, distribution, metabolism and excretion clashes are surfaced individually for each pair." />
          <AboutCard icon={Lock} title="Fully Offline" body="All analysis runs in your browser. No data ever leaves your device — patient-safe by design." />
        </div>

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { n: GENERIC_COUNT.toString(), l: "Generic Molecules", desc: "Comprehensive drug database" },
            { n: `${FORMULATION_COUNT}+`, l: "Brand Formulations", desc: "Commercial variants covered" },
            { n: "5", l: "CYP450 Enzymes", desc: "Metabolic pathways mapped" },
            { n: "100%", l: "On-Device Privacy", desc: "Zero data transmission" },
          ].map(s => (
            <div key={s.l} className="card-elevated p-5 text-center group hover:shadow-lg transition-all hover:-translate-y-1">
              <p className="text-4xl sm:text-3xl font-bold font-display text-gradient-amber mb-2">{s.n}</p>
              <p className="text-sm font-semibold text-foreground mb-1">{s.l}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/checker" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg amber-gradient text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <BookOpen className="w-4 h-4" /> 
            Start Checking Interactions 
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

const Feature = ({ to, icon: Icon, title, body }: { to: string; icon: any; title: string; body: string }) => (
  <Link to={to} className="card-elevated p-6 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
    <div className="w-12 h-12 rounded-xl amber-gradient flex items-center justify-center text-white shadow-md mb-4 group-hover:shadow-lg transition-all group-hover:scale-110">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold font-display text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{body}</p>
    <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
      Open <ArrowRight className="w-4 h-4" />
    </div>
  </Link>
);

const AboutCard = ({ icon: Icon, title, body }: { icon: any; title: string; body: string }) => (
  <div className="card-elevated p-6 hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl amber-gradient flex items-center justify-center text-white shadow-md mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-base font-bold font-display text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

export default Home;
