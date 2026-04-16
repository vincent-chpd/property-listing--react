'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, Mail, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';

type Agent = {
  fullName: string;
  createdBy: string;
  profilePicture: string;
  listingCount: number;
};

const AgentFinderPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filtered, setFiltered] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listing')
        .select('fullName, createdBy, profilePicture')
        .eq('active', true);

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Deduplicate by email and count listings per agent
      const agentMap = new Map<string, Agent>();
      for (const row of data) {
        if (!row.createdBy) continue;
        if (agentMap.has(row.createdBy)) {
          agentMap.get(row.createdBy)!.listingCount += 1;
        } else {
          agentMap.set(row.createdBy, {
            fullName: row.fullName || 'Unknown Agent',
            createdBy: row.createdBy,
            profilePicture: row.profilePicture || '',
            listingCount: 1,
          });
        }
      }

      const agentList = Array.from(agentMap.values()).sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
      setAgents(agentList);
      setFiltered(agentList);
      setLoading(false);
    };

    fetchAgents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    if (!query.trim()) {
      setFiltered(agents);
    } else {
      setFiltered(
        agents.filter(
          (a) =>
            a.fullName.toLowerCase().includes(query.toLowerCase()) ||
            a.createdBy.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="px-10 py-10">
      <h2 className="font-bold text-2xl">Agent Finder</h2>
      <p className="mt-2 text-gray-500">
        Browse our real estate agents and get in touch to buy, sell, or rent.
      </p>

      <div className="mt-6 flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-52 rounded-xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 text-center text-gray-400">
          {search ? `No agents found for "${search}"` : 'No agents found.'}
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-gray-400">
            {filtered.length} agent{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((agent) => (
              <div
                key={agent.createdBy}
                className="flex flex-col items-center gap-3 p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                {agent.profilePicture ? (
                  <Image
                    src={agent.profilePicture}
                    alt={agent.fullName}
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-20 h-20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                    {agent.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-semibold text-base">{agent.fullName}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 break-all">
                    {agent.createdBy}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Home className="h-3.5 w-3.5" />
                  {agent.listingCount} active listing
                  {agent.listingCount !== 1 ? 's' : ''}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-1 flex gap-2 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `mailto:${agent.createdBy}`)
                  }
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentFinderPage;
