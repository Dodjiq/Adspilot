/**
 * Script pour promouvoir un utilisateur en admin
 * 
 * Usage:
 * node scripts/promote-admin.js EMAIL
 * 
 * Exemple:
 * node scripts/promote-admin.js user@example.com
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes!');
  console.log('\nVérifie que ton .env contient:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function promoteToAdmin(email) {
  console.log(`🔍 Recherche de l'utilisateur: ${email}\n`);

  try {
    // Récupérer tous les utilisateurs
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    // Trouver l'utilisateur par email
    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ Utilisateur non trouvé: ${email}`);
      console.log('\n💡 Utilisateurs disponibles:');
      users.users.forEach(u => {
        console.log(`   - ${u.email} (${u.user_metadata?.role || 'user'})`);
      });
      process.exit(1);
    }

    console.log(`✅ Utilisateur trouvé: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Rôle actuel: ${user.user_metadata?.role || 'user'}\n`);

    // Mettre à jour le rôle
    console.log('🔄 Promotion en admin...\n');

    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'admin'
        }
      }
    );

    if (error) {
      throw error;
    }

    console.log('✅ Utilisateur promu en admin avec succès!\n');
    console.log('📊 Détails:');
    console.log(`   Email: ${data.user.email}`);
    console.log(`   ID: ${data.user.id}`);
    console.log(`   Rôle: ${data.user.user_metadata.role}`);
    console.log('\n🎉 L\'utilisateur peut maintenant accéder au panel admin!');
    console.log('   URL: https://ads-pilot.app/#/admin-pro/dashboard');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Récupérer l'email depuis les arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Email manquant!\n');
  console.log('Usage:');
  console.log('  node scripts/promote-admin.js EMAIL\n');
  console.log('Exemple:');
  console.log('  node scripts/promote-admin.js user@example.com');
  process.exit(1);
}

promoteToAdmin(email);
