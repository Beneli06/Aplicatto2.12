import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './components';

export const LandingPage: React.FC = () => (
  <div className="flex flex-col">
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Semillero de Investigación</span>{' '}
              <span className="block text-blue-600 xl:inline">Aplicatto</span>
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Innovación, tecnología y desarrollo social.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link to="/lineas" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg">
                  Ver Líneas
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);
