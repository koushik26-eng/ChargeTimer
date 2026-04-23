import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Clock, Database, Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const HomePage = () => {
  const features = [
    {
      icon: WifiOff,
      title: 'Offline-first design',
      description: 'Works seamlessly without internet. All your data is stored locally and syncs when you are back online.',
    },
    {
      icon: Database,
      title: 'Device profiles',
      description: 'Save multiple device configurations with custom calibration factors for accurate charging time predictions.',
    },
    {
      icon: Clock,
      title: 'Smart countdown timer',
      description: 'Get notified when charging is complete with browser notifications and audio alerts.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>ChargeTimer - Smart battery charging calculator</title>
        <meta name="description" content="Calculate optimal charging times for your devices with offline-first device profiles and smart countdown timers." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Smart charging made simple</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  Never overcharge your devices again
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-[65ch]">
                  Calculate precise charging times based on your device's battery level and charger wattage. Set timers, get notifications, and protect your battery health.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                    <Link to="/calculator">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-400/20 rounded-3xl blur-3xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1644571669401-9ab344866592"
                  alt="Modern smartphone charging with USB-C cable"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to optimize your charging routine
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <div className="glass-card rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Enter device details</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Input your current battery percentage, target level, and charger wattage. Save device profiles for quick access next time.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 md:order-2"
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-transparent">
                  <Database className="w-16 h-16 text-primary mb-4" />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-cyan-400/5 to-transparent">
                  <Zap className="w-16 h-16 text-primary mb-4" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="glass-card rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Get accurate time estimate</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our algorithm calculates charging time based on your 5-minute calibration factor and adds a safety buffer for targets above 80%.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-2 md:order-1"
              >
                <div className="glass-card rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Start the countdown</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Begin charging and let the timer run. You will receive a notification and audio alert when your device reaches the target level.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 md:order-2"
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-transparent">
                  <Clock className="w-16 h-16 text-primary mb-4" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need for smarter charging
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card-hover rounded-2xl p-8"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to optimize your charging?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start using ChargeTimer today and never worry about overcharging again.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Link to="/calculator">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 bg-card/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold">ChargeTimer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2026 ChargeTimer. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;