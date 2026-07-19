# 04 — Contenu, i18n & données

## Langues
FR (défaut détecté navigateur), العربية (AR, **RTL**), English (EN). L'utilisateur peut changer. Persister le choix.

## Règles RTL (AR)
- `dir="rtl"` sur la racine ; miroir des alignements, flèches, positions d'icônes, sens des dropdowns.
- Police AR : **Tajawal** en tête de pile.
- Chiffres : accepter chiffres arabes-orientaux dans l'UI si la locale l'exige (ex. étapes ١٢٣) ; garder les numéros de téléphone en format international.

## Libellés clés (FR / AR / EN)

### Auth
| FR | AR | EN |
|---|---|---|
| Continuer avec Google | المتابعة عبر Google | Continue with Google |
| Continuer avec l'e-mail | المتابعة عبر البريد | Continue with email |
| Se connecter | تسجيل الدخول | Log in |
| Créer un compte | إنشاء حساب | Create account |
| Mot de passe oublié ? | نسيت كلمة السر؟ | Forgot password? |
| Vous êtes avocat ? | هل أنت محامٍ؟ | Are you a lawyer? |
| Accéder à l'espace avocat | الدخول إلى فضاء المحامي | Go to lawyer area |

### Profil (US-021 / US-022)
| FR | AR | EN |
|---|---|---|
| Mon profil | ملفي الشخصي | My profile |
| Modifier mon profil | تعديل ملفي | Edit my profile |
| Mettez à jour vos informations personnelles. | حدّث معلوماتك الشخصية. | Update your personal information. |
| Informations personnelles | المعلومات الشخصية | Personal information |
| Lecture seule | للقراءة فقط | Read-only |
| Prénom / Nom | الاسم / النسب | First name / Last name |
| Email / Téléphone | البريد / الهاتف | Email / Phone |
| Pays / Ville / Nationalité | البلد / المدينة / الجنسية | Country / City / Nationality |
| Langue | اللغة | Language |
| Notifications | الإشعارات | Notifications |
| Notifications push | الإشعارات الفورية | Push notifications |
| Bientôt disponible | قريباً | Coming soon |
| Compte | الحساب | Account |
| Supprimer mon compte | حذف حسابي | Delete my account |
| Non renseigné | غير محدد | Not provided |
| Annuler / Enregistrer les modifications | إلغاء / حفظ التعديلات | Cancel / Save changes |
| Retour | رجوع | Back |
| Profil mis à jour | تم تحديث الملف | Profile updated |
| Vos informations ont bien été enregistrées. | تم حفظ معلوماتك بنجاح. | Your information has been saved. |
| Retour à mon profil | العودة إلى ملفي | Back to my profile |
| Sélectionner une ville | اختر مدينة | Select a city |
| La ville dépend du pays sélectionné. | تعتمد المدينة على البلد المحدد. | The city depends on the selected country. |

### Feedback
| FR | AR | EN |
|---|---|---|
| Profil mis à jour avec succès. | تم تحديث الملف بنجاح. | Profile updated successfully. |
| Impossible de mettre à jour votre profil. | تعذّر تحديث ملفك. | Couldn't update your profile. |
| Préférences enregistrées | تم حفظ التفضيلات | Preferences saved |
| Quitter sans enregistrer ? | المغادرة دون حفظ؟ | Leave without saving? |
| Vous avez des modifications non enregistrées. | لديك تعديلات غير محفوظة. | You have unsaved changes. |
| Continuer la modification | متابعة التعديل | Keep editing |
| Quitter sans enregistrer | المغادرة دون حفظ | Leave without saving |
| Le nom est obligatoire. | النسب إجباري. | Last name is required. |

## Données d'exemple (mock)
```json
{
  "user": {
    "prenom": "Ahmed",
    "nom": "Benali",
    "email": "ahmed.benali@exemple.ma",
    "telephone": "+212 6 12 34 56 78",
    "pays": "Maroc",
    "ville": "Casablanca",
    "nationalite": "Marocaine",
    "langue": "fr",
    "notifications": { "email": true, "push": true, "sms": false }
  },
  "options": {
    "pays": ["Maroc", "France", "Belgique", "Canada"],
    "villes": { "Maroc": ["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir"] },
    "nationalites": ["Marocaine", "Française", "Belge", "Canadienne"],
    "langues": [{"code":"fr","label":"Français"},{"code":"ar","label":"العربية"},{"code":"en","label":"English"}]
  }
}
```
SMS est toujours `false` + désactivé (« Bientôt disponible »).

## Micro-copie
Ton simple, direct, sans jargon juridique. Messages d'erreur bienveillants et orientés solution. Jamais culpabilisant.
