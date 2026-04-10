/**
 * Script pour lister tous les utilisateurs et leurs rôles
 * 
 * Usage:
 * node scripts/list-users.js
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

async function listUsers() {
  console.log('👥 Liste des utilisateurs AdsPilot\n');

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    if (users.users.length === 0) {
      console.log('ℹ️  Aucun utilisateur trouvé');
      return;
    }

    console.log(`📊 Total: ${users.users.length} utilisateur(s)\n`);
    console.log('─'.repeat(80));

    users.users.forEach((user, index) => {
      const role = user.user_metadata?.role || 'user';
      const roleEmoji = role === 'admin' ? '👑' : role === 'pro' ? '⭐' : '👤';
      const createdAt = new Date(user.created_at).toLocaleDateString('fr-FR');
      const lastSignIn = user.last_sign_in_at 
        ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR')
        : 'Jamais';

      console.log(`\n${index + 1}. ${roleEmoji} ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Rôle: ${role}`);
      console.log(`   Créé le: ${createdAt}`);
      console.log(`   Dernière connexion: ${lastSignIn}`);
      console.log(`   Confirmé: ${user.email_confirmed_at ? '✅' : '❌'}`);
    });

    console.log('\n' + '─'.repeat(80));
    
    // Statistiques
    const admins = users.users.filter(u => u.user_metadata?.role === 'admin').length;
    const pros = users.users.filter(u => u.user_metadata?.role === 'pro').length;
    const regularUsers = users.users.filter(u => !u.user_metadata?.role || u.user_metadata?.role === 'user').length;

    console.log('\n📈 Statistiques:');
    console.log(`   👑 Admins: ${admins}`);
    console.log(`   ⭐ Pro: ${pros}`);
    console.log(`   👤 Standard: ${regularUsers}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

listUsers();
