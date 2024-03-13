<template>
    <f7-page name="caritoko" id="container">
        <f7-toolbar bottom tabbar>
            <f7-link tab-link="#tab-1" tab-link-active>Order</f7-link>
            <f7-link tab-link="#tab-2" @click="updateSearch">Riwayat</f7-link>
            <f7-link tab-link="#tab-3">Profile</f7-link>
            <f7-link tab-link="#tab-4" @click="logout">Keluar</f7-link>
        </f7-toolbar>
        <f7-tabs animated @tab:show="tabChanged" id="containerTabs">
            <f7-tab id="tab-1" class="page-content" tab-active>
                <f7-searchbar class="searchbar" disable-button-text="Cancel" placeholder="Cari Apapun disini ..."
                    :clear-button="true"></f7-searchbar>
                <div id="leafletpeta"></div>
                <f7-block-title>Hasil Pencarian : </f7-block-title>
                <f7-list media-list dividers-ios strong-ios outline-ios id="listItems">
                    <f7-list-item link="#" :title="e.product_name" :after="formatPrice(e.product_price)"
                        subtitle=" 1,2 Meter" text="Expired : -" @click="getMarkerProduct(e)" v-for="e in listItems"
                        :key="e.id">
                        <template #media>
                            <img style="border-radius: 8px" :src="e.product_image" width="80" />
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-tab>
            <f7-tab id="tab-2" class="page-content">
                <f7-searchbar class="searchbar" disable-button-text="Cancel" placeholder="Cari Riwayat ..."
                    :clear-button="true"></f7-searchbar>
            </f7-tab>
            <f7-tab id="tab-3" class="page-content">
                <f7-block-title>Tab 3</f7-block-title>
                <f7-block>
                    <p>Tab 3 content</p>
                </f7-block>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>

<script>
import { on } from 'dom7';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default {
    props: {
        f7route: Object,
        f7router: Object,
    },
    data() {
        return {
            map: null,
            markers: [],
            listItems: [],
            locationNew: [],
            locationProduct: [],
            routingControl: null,
        }
    },
    methods: {
        onDeviceReady() {
            console.log("navigator.geolocation works well");

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    this.locationNew = await [position.coords.latitude, position.coords.longitude];

                    console.log('User Location : ', this.locationNew[0], this.locationNew[1]);

                    this.map = L.map('leafletpeta').setView(this.locationNew, 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                    }).addTo(this.map);

                    const yourHome = L.marker(this.locationNew).addTo(this.map)
                        .bindPopup('Your Home')
                        .openPopup();

                    // Hide routing control
                    this.$nextTick(() => {
                        const leafletContainer = document.querySelector('.leaflet-routing-container');
                        if (leafletContainer) {
                            leafletContainer.style.display = 'none';
                        }
                    });

                });
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.f7router.navigate('/');
            window.navigator.app.exitApp();
        },
        findAll() {
            const token = localStorage.getItem('token');

            fetch('https://karot.dev.catalis.app/api/v1/product/getProductByCoordinate?page=1&size=10&sort=createdAt%2C%20desc', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    this.listItems = res.data.data;
                    console.log("datanya ", this.listItems);
                })
                .catch(err => console.log(err));
        },
        async getMarkerProduct(e) {
            this.locationProduct = [e.lat, e.lng];

            console.log('Product Location : ', this.locationProduct[0], this.locationProduct[1]);
            console.log('Your Location : ', this.locationNew[0], this.locationNew[1]);

            // Remove previous routing control
            if (this.routingControl !== null) {
                await this.map.removeControl(this.routingControl);
            }

            // Remove existing markers
            await this.map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    this.map.removeLayer(layer);
                }
            });

            // await this.map.removeControl(this.routingControl);

            L.marker(this.locationNew).addTo(this.map)
                .bindPopup('Your Home')
                .openPopup();

            // Add new marker for product location
            L.marker(this.locationProduct).addTo(this.map)
                .bindPopup('Product Location')
                .openPopup();

            this.routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(this.locationNew[0], this.locationNew[1]), // Your Location
                    L.latLng(this.locationProduct[0], this.locationProduct[1])  // Product Location
                ],
                routeWhileDragging: true,
                lineOptions: {
                    styles: [
                        { color: 'blue', opacity: 0.6, weight: 4 }
                    ]
                },
            }).addTo(this.map);

            this.$nextTick(() => {
                const leafletContainer = document.querySelector('.leaflet-routing-container');
                if (leafletContainer) {
                    leafletContainer.style.display = 'none';
                }
            });

        },
        updateSearch() {
            this.findAll();
        },
        tabChanged(tab) {
            if (tab.el.id === 'tab-1') {
                this.findAll();
            }
        },
        formatPrice(price) {
            return price.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR'
            });
        }
    },
    mounted() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
        this.onDeviceReady();
        this.findAll();
    },
}
</script>

<style scoped>
#container {
    height: 100vh;
    margin: 0px;
}

.searchbar {
    margin-top: 20px;
}

#leafletpeta {
    height: 400px;
    width: 100%;
    margin-top: 40px;
    margin-bottom: 0px;
}

.leaflet-routing-container {
    font-size: 10px;
    /* Ubah ukuran font */
    width: 20px !important;
    /* Ubah lebar panel */
    height: 20px !important;
    /* Ubah tinggi panel */
}

#listItems {
    margin: 0px;
    max-height: calc(100vh - 680px);
    /* Sesuaikan tinggi maksimum dengan kebutuhan Anda */
    overflow-y: auto;
}

#containerTabs {
    margin: 0px;
}
</style>
