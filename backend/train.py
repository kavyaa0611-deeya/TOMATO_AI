import os
import json
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# -------------------------------
# 1️⃣ Dataset Paths
# -------------------------------
TRAIN_DIR = "C:/Users/kavya/tomato-disease-project/backend/dataset/train"
VAL_DIR = "C:/Users/kavya/tomato-disease-project/backend/dataset/val"

# -------------------------------
# 2️⃣ Parameters
# -------------------------------
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30
LR = 0.0001

# -------------------------------
# 3️⃣ Data Augmentation
# -------------------------------
train_datagen = ImageDataGenerator(
    rescale=1.0/255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest"
)

val_datagen = ImageDataGenerator(rescale=1.0/255)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True
)

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# -------------------------------
# 4️⃣ Save Label Mapping (IMPORTANT)
# -------------------------------
labels = list(train_generator.class_indices.keys())
print("\n✅ Class indices (label mapping):")
print(train_generator.class_indices)

with open("labels.txt", "w") as f:
    for label in labels:
        f.write(label + "\n")

# -------------------------------
# 5️⃣ Build Model (Transfer Learning)
# -------------------------------
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base layers initially

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation="relu")(x)
x = Dropout(0.4)(x)
output = Dense(len(labels), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=LR),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# -------------------------------
# 6️⃣ Callbacks
# -------------------------------
checkpoint = ModelCheckpoint(
    "best_tomato_model.h5",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

early_stop = EarlyStopping(
    monitor="val_accuracy",
    patience=5,
    restore_best_weights=True
)

# -------------------------------
# 7️⃣ Train Model
# -------------------------------
print("\n🚀 Training started...\n")
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stop],
    verbose=1
)

# -------------------------------
# 8️⃣ Fine-tune model (optional but boosts accuracy)
# -------------------------------
base_model.trainable = True
for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=Adam(learning_rate=LR/10),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

print("\n🎯 Fine-tuning model...\n")
history_fine = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=10,
    callbacks=[checkpoint, early_stop],
    verbose=1
)

# -------------------------------
# 9️⃣ Save Final Model
# -------------------------------
model.save("tomato_disease_model.h5")
print("\n✅ Model saved as 'tomato_disease_model.h5'")
print("✅ Labels saved as 'labels.txt'")
