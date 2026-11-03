<template>
  <div class="relative w-full flex-1 min-h-0 flex flex-col">
    <!-- Card transparente Liquid Glassmorphism 100% simétrica (w-full) -->
    <div class="relative w-full flex-1 min-h-0 flex flex-col justify-between rounded-[36px] border border-white/25 bg-white/[0.03] backdrop-blur-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden [clip-path:inset(0_round_36px)]">
      <!-- Contenedor con Scroll Snap Vertical para deslizar entre las 3 secciones del restaurante -->
    <div
      ref="scrollContainer"
      @scroll="handleScroll"
      class="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar relative z-10"
    >
      <!-- ================= TARJETA 1: PORTADA DEL RESTAURANTE & ATMÓSFERAS EN VIVO ================= -->
      <section class="snap-start snap-always w-full h-full flex flex-col gap-4 p-6 pb-3">
        <!-- Título y descripción -->
        <div class="space-y-2.5 shrink-0">
          <h1 class="text-[36px] leading-[1.06] font-normal tracking-[-0.03em] text-white font-sans">
            Fuego, Cava &amp;<br />
            Alta Mixología<br />
            <span class="text-[#FFB347]">en Metepec</span>
          </h1>

          <p class="text-[12px] leading-relaxed text-slate-200/85 font-light pr-3">
            Cortes Wagyu A5 a las brasas de encino, terraza climatizada con fogateros y más de 850 etiquetas en nuestra cava subterránea sobre Av. Comonfort. Toca cada zona para cambiar la vista:
          </p>
        </div>

        <!-- Selector visual de las 3 Zonas: escala su alto proporcionalmente y se centra en el espacio disponible -->
        <div class="flex-1 min-h-0 flex flex-col justify-center">
          <div class="w-full h-full max-h-[340px] flex flex-col gap-3">
            <button
              v-for="zone in experiences"
              :key="zone.id"
              @click="bookingStore.customVideoUrl = ''; bookingStore.selectedZoneId = zone.id"
              :class="[
                'group relative w-full flex-1 min-h-[68px] rounded-2xl overflow-hidden border text-left transition-all cursor-pointer flex flex-col justify-center px-4 py-2',
                bookingStore.selectedZoneId === zone.id
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                  : 'border-white/15 opacity-80 hover:opacity-100'
              ]"
            >
              <img
                :src="zone.imageUrl"
                :alt="zone.shortName"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/25"></div>
              <div class="relative z-10 flex items-center justify-between w-full">
                <div>
                  <span class="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                    <span
                      v-if="bookingStore.selectedZoneId === zone.id"
                      class="inline-block w-2 h-2 rounded-full bg-amber-400"
                    ></span>
                    {{ zone.shortName }}
                  </span>
                  <span class="text-[10px] text-slate-300/90 block mt-0.5">{{ zone.capacityLabel }} • {{ zone.dressCode }}</span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-black/55 border border-white/15 text-[9px] text-amber-300 font-semibold">
                  {{ zone.badge }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Rating e indicación sutil de deslizar -->
        <!-- <div class="pt-1 flex items-end justify-between">
          <button
            @click="scrollToCard(1)"
            class="flex items-center gap-1.5 text-[11px] text-white/75 hover:text-white transition-colors cursor-pointer bg-black/35 px-3 py-1.5 rounded-full border border-white/10"
          >
            <span class="animate-bounce text-amber-400">↓</span>
            <span>Ver platillos y zonas</span>
          </button>

          <div class="flex flex-col items-end text-right">
            <div class="flex items-center gap-1 text-white">
              <svg class="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-lg font-bold tracking-tight">{{ bookingStore.selectedZone.rating.toFixed(1) }}</span>
            </div>
            <span class="text-[10px] text-slate-300/80 font-light">
              1,420+ reseñas verificadas
            </span>
          </div>
        </div> -->
      </section>

      <!-- ================= TARJETA 2: DETALLE DE LA ZONA SELECCIONADA & GALERÍA REAL ================= -->
      <section class="snap-start snap-always w-full h-full flex flex-col justify-between p-6 pt-5 pb-3">
        <!-- Encabezado de sección -->
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
            {{ bookingStore.selectedZone.badge }}
          </span>
          <span class="text-xs font-mono text-white/60">02 / 04 · Zonas VIP</span>
        </div>

        <!-- Información detallada de la zona activa -->
        <div class="space-y-3">
          <div>
            <h2 class="text-[28px] leading-[1.1] font-normal tracking-[-0.02em] text-white font-sans">
              {{ bookingStore.selectedZone.name }}
            </h2>
            <p class="text-[11px] text-amber-300/90 font-medium mt-0.5">
              {{ bookingStore.selectedZone.subtitle }}
            </p>
          </div>

          <p class="text-xs leading-relaxed text-slate-200/85 font-light pr-2">
            {{ bookingStore.selectedZone.description }}
          </p>

          <!-- Carrusel horizontal de 4 imágenes de la zona (Toca una para abrir el modal animado) -->
          <div class="space-y-2 pt-0.5">
            <!-- <div class="flex items-center justify-between px-0.5">
              <span class="text-[10px] uppercase tracking-wider text-amber-300/90 font-bold">
                Galería ({{ activeSlide + 1 }} / {{ bookingStore.selectedZone.gallery.length }}) · Toca para ampliar
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="scrollCarousel(-1)"
                  class="w-6 h-6 rounded-full bg-black/50 hover:bg-white/20 border border-white/15 text-white text-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  @click="scrollCarousel(1)"
                  class="w-6 h-6 rounded-full bg-black/50 hover:bg-white/20 border border-white/15 text-white text-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </div>
            </div> -->

            <div
              ref="carouselRef"
              @scroll="handleCarouselScroll"
              class="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-1 mt-2"
            >
              <button
                v-for="(item, idx) in bookingStore.selectedZone.gallery"
                :key="idx"
                type="button"
                @click="openModal(idx)"
                class="group relative shrink-0 w-[78%] h-38 snap-center rounded-2xl overflow-hidden border border-white/20 hover:border-amber-400/70 shadow-lg text-left transition-all duration-300 cursor-pointer"
              >
                <img
                  :src="item.url"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[9px] text-white/90 font-medium">
                  ⤢ Ampliar
                </span>
                <div class="absolute bottom-2.5 left-3 right-3">
                  <span class="text-xs font-bold text-white block truncate">{{ item.title }}</span>
                  <span class="text-[10px] text-slate-300/90 block truncate">{{ item.caption }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Chips de amenidades de la zona -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="item in bookingStore.selectedZone.amenities"
              :key="item.name"
              class="px-2.5 py-1 rounded-full bg-black/45 text-[10px] text-white/95 border border-white/15 backdrop-blur-md"
            >
              ✦ {{ item.name }}
            </span>
          </div>
        </div>

        <!-- Ficha rápida de Dress Code y Ticket Promedio -->
        <!-- <div class="p-3 rounded-2xl bg-black/45 border border-white/15 flex items-center justify-between text-xs">
          <div>
            <span class="text-[10px] uppercase text-slate-400 font-bold block">Ticket Promedio</span>
            <span class="text-white font-bold">{{ bookingStore.selectedZone.avgSpend }}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase text-slate-400 font-bold block">Dress Code</span>
            <span class="text-amber-300 font-semibold">{{ bookingStore.selectedZone.dressCode }}</span>
          </div>
        </div> -->

        <div class="flex flex-col items-end text-right">
          <div class="flex items-center gap-1 text-white">
            <svg class="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-lg font-bold tracking-tight">{{ bookingStore.selectedZone.rating.toFixed(1) }}</span>
          </div>
          <span class="text-[10px] text-slate-300/80 font-light">
            1,420+ reseñas verificadas
          </span>
        </div>

      </section>

      <!-- ================= TARJETA 3: MENÚ INSIGNIA DEL CHEF & MIXOLOGÍA ================= -->
      <section class="snap-start snap-always w-full h-full flex flex-col justify-between p-6 pt-5 pb-3">
        <!-- Indicador de sección -->
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-semibold border border-white/15">
            Carta Nocturna · Chef Mateo Valdés
          </span>
          <span class="text-xs font-mono text-white/60">03 / 04 · Menú</span>
        </div>

        <!-- Lista visual de Platillos Insignia con tarjetas más grandes y clic para abrir modal -->
        <div class="space-y-3 my-auto">
          <div class="flex items-end justify-between">
            <h2 class="text-[26px] leading-[1.1] font-normal tracking-[-0.02em] text-white font-sans">
              Platillos Insignia &amp; Coctelería
            </h2>
          </div>

          <div class="space-y-2.5">
            <button
              v-for="(dish, dIdx) in signatureDishes"
              :key="dish.id"
              type="button"
              @click="openDishModal(dIdx)"
              class="group w-full flex items-center gap-3.5 p-3 rounded-2xl bg-black/50 hover:bg-black/65 border border-white/15 hover:border-amber-400/60 backdrop-blur-md text-left transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div class="relative w-[74px] h-[74px] rounded-xl overflow-hidden shrink-0 border border-white/20">
                <img
                  :src="dish.imageUrl"
                  :alt="dish.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1 mb-0.5">
                  <span class="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                    {{ dish.tag }}
                  </span>
                  <span class="text-sm font-black text-amber-400 shrink-0">{{ dish.price }}</span>
                </div>
                <span class="text-[13px] font-bold text-white truncate block group-hover:text-amber-200 transition-colors">
                  {{ dish.name }}
                </span>
                <p class="text-[11px] text-slate-300/85 line-clamp-2 leading-snug mt-0.5">
                  {{ dish.description }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Nota de Pase Digital VIP -->
        <!-- <div class="flex items-center justify-between text-[11px] text-slate-300 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10">
          <span>📲 Pase directo a Google &amp; Apple Wallet</span>
          <span class="text-emerald-400 font-bold">Sin cargo previo</span>
        </div> -->
      </section>

      <!-- ================= TARJETA 4: HORARIO Y UBICACIÓN EN METEPEC ================= -->
      <section class="snap-start snap-always w-full h-full flex flex-col justify-between p-6 pt-5 pb-3 gap-2.5">
        <!-- Indicador de sección -->
        <div class="flex items-center justify-between shrink-0">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
            Zona Dorada · Metepec
          </span>
          <span class="text-xs font-mono text-white/60">04 / 04 · Horario &amp; Mapa</span>
        </div>

        <!-- 1. BLOQUE DE HORARIO MUY VISIBLE Y MÁS AMPLIO -->
        <div class="space-y-2 shrink-0">
          <h2 class="text-[28px] leading-[1.08] font-normal tracking-[-0.02em] text-white font-sans">
            Horario
          </h2>
          <div class="p-4 rounded-2xl bg-black/55 border border-white/20 backdrop-blur-md space-y-2.5 shadow-lg">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span class="text-[11px] uppercase tracking-wider font-bold text-amber-300 block">
                  Martes a Jueves
                </span>
                <span class="text-base font-black text-white tracking-tight block mt-0.5">
                  13:30 – 00:30 hrs
                </span>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[10px] font-bold text-emerald-300">
                Abierto Hoy
              </span>
            </div>

            <div class="flex items-center justify-between pt-0.5">
              <div>
                <span class="text-[11px] uppercase tracking-wider font-bold text-amber-300 block">
                  Viernes a Domingo
                </span>
                <span class="text-base font-black text-white tracking-tight block mt-0.5">
                  13:30 – 01:30 hrs
                </span>
              </div>
              <div class="text-right">
                <span class="text-[11px] font-semibold text-white/90 block">Cocina &amp; Cava</span>
                <span class="text-[10px] text-slate-300/80 block">Valet Parking VIP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. BLOQUE DE UBICACIÓN Y MAPA -->
        <div class="flex-1 min-h-0 flex flex-col gap-2">
          <div class="shrink-0">
            <h3 class="text-[22px] leading-[1.1] font-normal tracking-[-0.02em] text-white font-sans">
              Ubicación
            </h3>
            <p class="text-[11px] text-slate-200/90 leading-snug mt-0.5">
              <strong class="text-white">Av. Ignacio Comonfort #1500</strong>, Zona Dorada (frente a Town Square), Metepec, Edo. Méx.
            </p>
          </div>

          <!-- Mapa Interactivo de Metepec (Estilo Dark Luxury) -->
          <div class="relative flex-1 min-h-[125px] w-full rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-xl">
            <iframe
              title="Mapa Vespera Hub Metepec"
              src="https://www.google.com/maps?q=Av.+Ignacio+Comonfort+1500,+Metepec,+Estado+de+Mexico&z=16&output=embed"
              class="w-full h-full border-0 [filter:invert(90%)_hue-rotate(180deg)_brightness(95%)_contrast(90%)]"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <!-- Botones para abrir directamente en Apps de Navegación -->
        <div class="space-y-1.5 shrink-0">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85 block px-0.5">
            Abrir Ruta en tu App de Navegación
          </span>
          <div class="grid grid-cols-3 gap-2">
            <!-- Google Maps -->
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+Ignacio+Comonfort+1500,+Metepec,+Estado+de+Mexico"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/15 hover:border-amber-400/60 transition-all cursor-pointer text-center"
            >
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span class="text-[11px] font-bold text-white leading-tight">Google Maps</span>
            </a>

            <!-- Waze -->
            <a
              href="https://waze.com/ul?q=Av.%20Ignacio%20Comonfort%201500%20Metepec&ll=19.2618,-99.6052&navigate=yes"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/15 hover:border-sky-400/60 transition-all cursor-pointer text-center"
            >
              <svg class="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              <span class="text-[11px] font-bold text-white leading-tight">Waze</span>
            </a>

            <!-- Apple Maps -->
            <a
              href="https://maps.apple.com/?q=Vespera+Hub+Metepec&address=Av.+Ignacio+Comonfort+1500,+Metepec,+Estado+de+Mexico&ll=19.2618,-99.6052"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/15 hover:border-white/50 transition-all cursor-pointer text-center"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span class="text-[11px] font-bold text-white leading-tight">Apple Maps</span>
            </a>
          </div>
        </div>
      </section>
    </div>

      <!-- ================= FOOTER FIJO CON BOTÓN RESERVAR MESA ================= -->
      <footer class="relative z-30 px-6 py-4 pb-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent rounded-b-[36px] overflow-hidden">
        <button
          @click="$emit('startBooking')"
          class="w-full h-14 rounded-full bg-white text-[#0F172A] font-bold text-sm shadow-[0_12px_28px_rgba(0,0,0,0.45)] hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <span>Reservar Mesa · {{ bookingStore.selectedZone.shortName }}</span>
          <!-- <span class="text-amber-600 font-black">→</span> -->
        </button>
      </footer>
    </div>

    <!-- Indicadores de paginación vertical justo sobre el borde derecho de la card -->
    <div class="absolute right-[-0.1rem] top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto">
      <button
        v-for="index in 4"
        :key="index"
        @click="scrollToCard(index - 1)"
        :class="[
          'rounded-full transition-all duration-300 cursor-pointer',
          activeCard === index - 1
            ? 'w-1.5 h-7 bg-amber-400'
            : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
        ]"
        :aria-label="`Ir a sección ${index}`"
      ></button>
    </div>

    <!-- ================= MODAL LIGHTBOX ANIMADO DE GALERÍA ================= -->
    <Transition name="gallery-modal">
      <div
        v-if="selectedModalIndex !== null && activeModalItem"
        @click.self="closeModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      >
        <div class="relative w-full max-w-[390px] rounded-[32px] overflow-hidden border border-white/25 bg-[#0F171E]/95 shadow-[0_25px_70px_rgba(0,0,0,0.75)] gallery-card-pop">
          <!-- Imagen principal con transición suave -->
          <div class="relative h-72 w-full overflow-hidden bg-black">
            <Transition name="slide-fade" mode="out-in">
              <img
                :key="activeModalItem.url"
                :src="activeModalItem.url"
                :alt="activeModalItem.title"
                class="w-full h-full object-cover"
              />
            </Transition>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-black/40"></div>

            <!-- Badge superior y botón cerrar -->
            <div class="absolute top-3.5 left-4 right-4 flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {{ bookingStore.selectedZone.shortName }} · {{ selectedModalIndex + 1 }} / {{ bookingStore.selectedZone.gallery.length }}
              </span>
              <button
                type="button"
                @click="closeModal"
                class="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- Controles laterales dentro del modal -->
            <button
              type="button"
              @click="stepModal(-1)"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center text-sm transition-all cursor-pointer backdrop-blur-md"
            >
              ‹
            </button>
            <button
              type="button"
              @click="stepModal(1)"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center text-sm transition-all cursor-pointer backdrop-blur-md"
            >
              ›
            </button>
          </div>

          <!-- Detalles y miniaturas de las 4 fotos -->
          <div class="p-5 pt-3 space-y-4">
            <div>
              <h3 class="text-lg font-bold text-white leading-snug">{{ activeModalItem.title }}</h3>
              <p class="text-xs text-slate-300/85 leading-relaxed mt-1">{{ activeModalItem.caption }}</p>
            </div>

            <!-- Miniaturas para cambiar rápido entre las 4 imágenes -->
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(thumb, tIdx) in bookingStore.selectedZone.gallery"
                :key="tIdx"
                type="button"
                @click="selectedModalIndex = tIdx"
                :class="[
                  'h-12 rounded-xl overflow-hidden border transition-all cursor-pointer',
                  selectedModalIndex === tIdx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                    : 'border-white/15 opacity-55 hover:opacity-90'
                ]"
              >
                <img :src="thumb.url" :alt="thumb.title" class="w-full h-full object-cover" />
              </button>
            </div>

            <button
              type="button"
              @click="closeModal(); $emit('startBooking')"
              class="w-full h-11 rounded-full bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              Reservar en {{ bookingStore.selectedZone.shortName }} →
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================= MODAL ANIMADO DE DETALLE DE PLATILLO INSIGNIA ================= -->
    <Transition name="gallery-modal">
      <div
        v-if="selectedDishIndex !== null && activeDishItem"
        @click.self="closeDishModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      >
        <div class="relative w-full max-w-[390px] rounded-[32px] overflow-hidden border border-white/25 bg-[#0F171E]/95 shadow-[0_25px_70px_rgba(0,0,0,0.75)] gallery-card-pop">
          <!-- Fotografía del platillo con transición suave -->
          <div class="relative h-64 w-full overflow-hidden bg-black">
            <Transition name="slide-fade" mode="out-in">
              <img
                :key="activeDishItem.id"
                :src="activeDishItem.imageUrl"
                :alt="activeDishItem.name"
                class="w-full h-full object-cover"
              />
            </Transition>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-black/45"></div>

            <!-- Categoría y botón cerrar -->
            <div class="absolute top-3.5 left-4 right-4 flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/35 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {{ activeDishItem.category }} · {{ activeDishItem.tag }}
              </span>
              <button
                type="button"
                @click="closeDishModal"
                class="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- Controles laterales para navegar entre los 4 platillos -->
            <button
              type="button"
              @click="stepDishModal(-1)"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center text-sm transition-all cursor-pointer backdrop-blur-md"
            >
              ‹
            </button>
            <button
              type="button"
              @click="stepDishModal(1)"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center text-sm transition-all cursor-pointer backdrop-blur-md"
            >
              ›
            </button>

            <!-- Precio flotante sobre la imagen -->
            <div class="absolute bottom-3 left-5 right-5 flex items-end justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-widest text-amber-300/90 font-bold block">
                  {{ activeDishItem.portion }}
                </span>
                <h3 class="text-xl font-bold text-white leading-tight">{{ activeDishItem.name }}</h3>
              </div>
              <span class="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-sm shadow-lg">
                {{ activeDishItem.price }}
              </span>
            </div>
          </div>

          <!-- Ficha gastronómica detallada del platillo -->
          <div class="p-5 pt-3 space-y-3.5">
            <p class="text-xs text-slate-200/90 leading-relaxed">
              {{ activeDishItem.description }}
            </p>

            <!-- Ingredientes clave -->
            <div class="space-y-1.5">
              <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Ingredientes &amp; Técnica
              </span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="ing in activeDishItem.ingredients"
                  :key="ing"
                  class="px-2.5 py-1 rounded-full bg-white/8 border border-white/15 text-[10px] text-white/90 font-medium"
                >
                  ✦ {{ ing }}
                </span>
              </div>
            </div>

            <!-- Nota de Maridaje del Sommelier -->
            <div class="p-3 rounded-2xl bg-black/45 border border-amber-400/20 flex items-start gap-2.5">
              <span class="text-base leading-none mt-0.5">🍷</span>
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-amber-300 block">
                  Maridaje Sugerido por Sommelier
                </span>
                <p class="text-[11px] text-slate-300/90 leading-snug mt-0.5">
                  {{ activeDishItem.pairing }}
                </p>
              </div>
            </div>

            <!-- Miniaturas de los 4 platillos -->
            <div class="grid grid-cols-4 gap-2 pt-0.5">
              <button
                v-for="(dThumb, dIdx) in signatureDishes"
                :key="dThumb.id"
                type="button"
                @click="selectedDishIndex = dIdx"
                :class="[
                  'h-11 rounded-xl overflow-hidden border transition-all cursor-pointer',
                  selectedDishIndex === dIdx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                    : 'border-white/15 opacity-55 hover:opacity-90'
                ]"
              >
                <img :src="dThumb.imageUrl" :alt="dThumb.name" class="w-full h-full object-cover" />
              </button>
            </div>

            <button
              type="button"
              @click="closeDishModal(); $emit('startBooking')"
              class="w-full h-11 rounded-full bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              Reservar Mesa para Degustar →
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBookingStore } from '~/stores/booking'
import { EXPERIENCES, SIGNATURE_DISHES } from '~/data/experiences'

defineEmits<{
  (e: 'startBooking'): void
}>()

const bookingStore = useBookingStore()
const experiences = EXPERIENCES
const signatureDishes = SIGNATURE_DISHES

const scrollContainer = ref<HTMLElement | null>(null)
const activeCard = ref(0)

// Estado del carrusel horizontal de 4 fotos y modal animado
const carouselRef = ref<HTMLElement | null>(null)
const activeSlide = ref(0)
const selectedModalIndex = ref<number | null>(null)
const selectedDishIndex = ref<number | null>(null)

const activeModalItem = computed(() => {
  if (selectedModalIndex.value === null) return null
  return bookingStore.selectedZone.gallery[selectedModalIndex.value] || null
})

const activeDishItem = computed(() => {
  if (selectedDishIndex.value === null) return null
  return signatureDishes[selectedDishIndex.value] || null
})

watch(() => bookingStore.selectedZoneId, () => {
  activeSlide.value = 0
  if (carouselRef.value) {
    carouselRef.value.scrollTo({ left: 0, behavior: 'smooth' })
  }
})

const handleCarouselScroll = () => {
  if (!carouselRef.value) return
  const slideWidth = carouselRef.value.clientWidth * 0.78
  if (slideWidth > 0) {
    activeSlide.value = Math.min(
      bookingStore.selectedZone.gallery.length - 1,
      Math.round(carouselRef.value.scrollLeft / slideWidth)
    )
  }
}

const scrollCarousel = (dir: number) => {
  if (!carouselRef.value) return
  const total = bookingStore.selectedZone.gallery.length
  const next = Math.max(0, Math.min(total - 1, activeSlide.value + dir))
  activeSlide.value = next
  const slideWidth = carouselRef.value.clientWidth * 0.78
  carouselRef.value.scrollTo({
    left: next * slideWidth,
    behavior: 'smooth'
  })
}

const openModal = (idx: number) => {
  selectedModalIndex.value = idx
}

const closeModal = () => {
  selectedModalIndex.value = null
}

const stepModal = (dir: number) => {
  if (selectedModalIndex.value === null) return
  const total = bookingStore.selectedZone.gallery.length
  selectedModalIndex.value = (selectedModalIndex.value + dir + total) % total
}

const openDishModal = (idx: number) => {
  selectedDishIndex.value = idx
}

const closeDishModal = () => {
  selectedDishIndex.value = null
}

const stepDishModal = (dir: number) => {
  if (selectedDishIndex.value === null) return
  const total = signatureDishes.length
  selectedDishIndex.value = (selectedDishIndex.value + dir + total) % total
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  const scrollTop = scrollContainer.value.scrollTop
  const clientHeight = scrollContainer.value.clientHeight
  if (clientHeight > 0) {
    activeCard.value = Math.round(scrollTop / clientHeight)
  }
}

const scrollToCard = (index: number) => {
  if (!scrollContainer.value) return
  const clientHeight = scrollContainer.value.clientHeight
  scrollContainer.value.scrollTo({
    top: index * clientHeight,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
/* Ocultar barra de scroll para navegación táctil pura */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animación elástica de apertura del modal de galería */
.gallery-modal-enter-active,
.gallery-modal-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.gallery-modal-enter-active .gallery-card-pop,
.gallery-modal-leave-active .gallery-card-pop {
  transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease;
}
.gallery-modal-enter-from,
.gallery-modal-leave-to {
  opacity: 0;
}
.gallery-modal-enter-from .gallery-card-pop {
  transform: scale(0.88) translateY(20px);
  opacity: 0;
}
.gallery-modal-leave-to .gallery-card-pop {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}

/* Transición suave entre fotos dentro del modal */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.22s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: scale(1.03);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
