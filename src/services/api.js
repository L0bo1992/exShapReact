import { images } from './imageAssets';

export const searchSuppliers = async (query, minPrice, maxPrice, currency) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Shenzhen Electronics Co.',
          product: query || 'Smartphone Accessories',
          price: 50,
          currency: 'USD',
          image: images.supplierPlaceholder,
          contact: 'contact@shenzhenelec.com',
        },
        {
          id: '2',
          name: 'Guangzhou Textiles Ltd.',
          product: query || 'Cotton Fabric',
          price: 120,
          currency: 'USD',
          image: images.supplierPlaceholder,
          contact: 'sales@gztextiles.com',
        },
        {
          id: '3',
          name: 'Hangzhou Machinery',
          product: query || 'Hydraulic Pump',
          price: 500,
          currency: 'USD',
          image: images.supplierPlaceholder,
          contact: 'info@hzmachinery.com',
        },
        {
          id: '4',
          name: 'Yiwu Toys Factory',
          product: query || 'Plush Toys',
          price: 5,
          currency: 'USD',
          image: images.supplierPlaceholder,
          contact: 'sales@yiwutoys.com',
        },
        {
          id: '5',
          name: 'Ningbo Tools',
          product: query || 'Hand Tools Set',
          price: 35,
          currency: 'USD',
          image: images.supplierPlaceholder,
          contact: 'export@ningbotools.com',
        }
      ]);
    }, 1000);
  });
};

export const getOpportunities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'High Demand for Solar Panels in Europe',
          description: 'Recent energy policies have skyrocketed the demand for residential solar panels. Connect with top tier manufacturers in Jiangsu.',
          image: images.opportunitySolar,
        },
        {
          id: '2',
          title: 'Electric Vehicle Components',
          description: 'Supply chain gaps in EV battery components offer a lucrative opening for new distributors.',
          image: images.opportunityEV,
        },
        {
          id: '3',
          title: 'Smart Home IoT Devices',
          description: 'New standards in smart home connectivity (Matter) are driving a refresh cycle for home automation hardware.',
          image: images.opportunityIoT,
        },
      ]);
    }, 800);
  });
};

export const convertCurrency = async (amount, from, to) => {
    // Mock conversion rates
    const rates = {
        'USD': 1,
        'CNY': 7.2,
        'EUR': 0.92,
        'NGN': 1500, // Example
    };
    
    // Simple conversion logic mock
    const rateFrom = rates[from] || 1;
    const rateTo = rates[to] || 1;
    
    // convert to USD then to target
    const inUSD = amount / rateFrom;
    return inUSD * rateTo;
}

export const generateProforma = async (supplierId, quantity) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Mock PDF
                totalCost: (Math.random() * 1000 * quantity).toFixed(2)
            });
        }, 1500);
    })
}
