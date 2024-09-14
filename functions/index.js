/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkExpiringItems = functions.pubsub.schedule("every 24 hours")
    .onRun(async (context) => {
      const now = new Date();
      const warningDate = new Date();
      warningDate.setDate(now.getDate() + 5); // Verificar ítems que vencen
      // en los próximos 5 días

      try {
      // Obtener todos los usuarios
        const usersSnapshot = await admin.firestore().collection("usuarios")
            .get();

        // Usar for...of para manejar async/await correctamente
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();

          // Verificar si el usuario tiene un token FCM
          if (!userData.fcmToken) {
            console.log(`El usuario ${userId} no tiene un token FCM registrado.
                `);
            continue;
          }

          // Obtener el inventario del usuario
          const inventorySnapshot = await admin.firestore()
              .collection("usuarios")
              .doc(userId)
              .collection("inventario")
              .get();

          const expiringItems = [];

          // Revisar cada ítem del inventario
          inventorySnapshot.forEach((itemDoc) => {
            const itemData = itemDoc.data();
            const expirationDate = new Date(itemData.fechaVencimiento);

            // Verificar si el ítem está próximo a vencer
            if (expirationDate <= warningDate && expirationDate >= now) {
              expiringItems.push(itemData.nombre);
            }
          });

          // Si hay ítems por vencer, enviar la notificación
          if (expiringItems.length > 0) {
            const message = {
              notification: {
                title: "Alerta de vencimiento",
                body: `Ítems por vencer: ${expiringItems.join(", ")}`,
              },
              token: userData.fcmToken, // Token FCM del usuario
            };

            try {
            // Enviar la notificación
              const response = await admin.messaging().send(message);
              console.log(`Notificación enviada a ${userId}:`, response);
            } catch (error) {
              console.error(`Error al enviar la notificación a ${userId}:`
                  , error);
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener los usuarios o inventarios:", error);
      }

      return null;
    });
